import { type PathLike, readdirSync, readFileSync } from 'fs'
import { mergeConfig, Plugin, ResolvedConfig } from 'vite'
import { glob } from 'glob'
import path from 'node:path'
import sharp from 'sharp'
import fs from 'node:fs'
import fse from 'node:fs/promises'
import pLimit from './p-limit'
import postcss from 'postcss'

const idPrefix = 'icon'
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile(dir: PathLike): string[] {
	if (!dir) return []
	const svgRes = []
	const dirents = readdirSync(dir, {
		withFileTypes: true
	})
	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			svgRes.push(...findSvgFile(dir + dirent.name + '/'))
		} else {
			const svg = readFileSync(dir + dirent.name)
				.toString()
				.replace(clearReturn, '')
				.replace(svgTitle, ($1, $2) => {
					// console.log(++i)
					// console.log(dirent.name)
					let width = 0
					let height = 0
					let content = $2.replace(clearHeightWidth, (s1: any, s2: string, s3: number) => {
						if (s2 === 'width') {
							width = s3
						} else if (s2 === 'height') {
							height = s3
						}
						return ''
					})
					if (!hasViewBox.test($2)) {
						content += `viewBox="0 0 ${width} ${height}"`
					}
					return `<symbol id="${idPrefix}-${dirent.name.replace('.svg', '')}" ${content}>`
				})
				.replace('</svg>', '</symbol>')
			svgRes.push(svg)
		}
	}
	return svgRes
}

export const VitePluginHtml = (dir?: string): Plugin => {
	const res = findSvgFile(dir);
	let config: ResolvedConfig;
	return {
		name: 'vite-plugin-html',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		transformIndexHtml(html) {
			const isBuild = config.command === 'build';
			let configKey = process.env.NODE_ENV || ''
			const configStr = `window.CONFIG = Object.freeze(${JSON.stringify(
				{ ...config.env, tenant: `${configKey}` },
				null,
				2
			)});`.replace(/\s/g, '')
			const tags: any[] = [

			]
			if (res.length) {
				tags.push({
					tag: 'svg',
					injectTo: 'body-prepend',
					attrs: {
						xmlns: 'http://www.w3.org/2000/svg',
						'xmlns:xlink': 'http://www.w3.org/1999/xlink',
						style: 'position: absolute; width: 0; height: 0'
					},
					children: res.join('')
				})
			}
			if (isBuild) {
				tags.push({
					tag: 'script',
					injectTo: 'head',
					children: configStr
				})
			};
			return tags;
		},
	}
}
interface  AssetsOptions{
	webp: boolean;
}
export const VitePluginStyle = (): Plugin => {
	let config: ResolvedConfig;
	const styleVirtualModuleId = 'vite:style'
	const styleResolvedVirtualModuleId = '\0' + styleVirtualModuleId;
	const getStyle = () => {
		const MAINCOLOR = config.env?.VITE_MAINCOLOR;
		const VITE_HOME = config.env.VITE_HOME;
		return `${VITE_HOME ? `import "@/assets/styles/other/${VITE_HOME}/reset.scss"\n` : ''}
		 import "@/assets/${MAINCOLOR}/reset.scss"\n
		 import "@/assets/${MAINCOLOR}/root.scss"
		`
	}
	return {
		name: 'vite-plugin-style',
		enforce: 'pre',
		async configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		resolveId(id: string) {
			if (id === styleVirtualModuleId) return styleResolvedVirtualModuleId
			return null
		},
		load(id) {
			if (id === styleResolvedVirtualModuleId) {
				return getStyle();
			}
			return null
		},
	}
}
export function ViteImagePlugin({webp}:AssetsOptions={webp:false}): Plugin {
	let viteConfig: ResolvedConfig;
	return {
		name: 'vite:image-sharp', // Plugin name
		apply: "build",
		configResolved(resolvedConfig: ResolvedConfig) {
			viteConfig = resolvedConfig;
		},
		config(config) {
			return mergeConfig(config, {

				build: {
					rollupOptions: {
						plugins: [
							{
								name: 'vite:remove-console-warn',
								renderChunk(code: string) {
									if (!code.includes('meta标签')) return code;
									const regex = /console\.warn\(["']将根据已有的meta标签来设置缩放比例["']\);/g;
									return code.replace(regex, '');
								},
							},
						],
					}
				}
			})
		},
		async closeBundle() {
			let output = viteConfig.build.outDir;
			const assetsDir = viteConfig.build.assetsDir;
			const imageDir = path.resolve(output,assetsDir);
			if (!fs.existsSync(imageDir)) {
				return;
			};
			// webp转换开关
			if (!webp)return;
			const postcssWebpReplace = {
				postcssPlugin: 'postcss-webp-replace',
				Declaration(decl) {
					if (decl.value && decl.value.includes('url(')) {
						decl.value = decl.value.replace(
							/url\(([^)]+?)\.(png|jpg)\)/g,
							(match, p1) => `url(${p1}.webp)`
						);
					}
				}
			};
			const files = await glob(`**/**/*.{png,jpg}`, {
				ignore: ['node_modules'],
				cwd: imageDir,
			});
			const css = await glob(`**/**/*.css`, {
				ignore: ['node_modules'],
				cwd: imageDir,
			});
			if (files.length) {
				const limit = pLimit(5);
				const imagePromises = files.map(file => limit(async () => {
					const filePath = path.join(imageDir, file);
					if (/\.(jpg|png)$/.test(filePath)) {

						try {
							await sharp(filePath)
								.webp({ quality: 90 })
								.toFile(filePath.replace(/\.(jpg|png)$/, '.webp'));
						} catch (e) {
							console.error(`Error processing image ${filePath}:`, e.message);
						}
					}
				}));
				await Promise.all(imagePromises);
				console.log('\n Images optimized');
			};
			if (css.length) {
				const limit = pLimit(5); // Set concurrency limit to 5
				const imagePromises = css.map(file => limit(async () => {
					const filePath = path.join(imageDir, file);
					if (/\.(css)$/.test(filePath)) {
						try {
							const css = await fse.readFile(filePath, 'utf8');
							const result = await postcss([postcssWebpReplace]).process(css, { from: filePath });
							await fse.writeFile(filePath, result.css);
						} catch (e) {
							console.error(`Error processing css ${filePath}:`, e);
						}
					}
				}));
				await Promise.all(imagePromises);
				console.log('\n css optimized');
			}

		},
	}
}
export function vitePluginGtag(gtagId): Plugin {
	return {
		name: 'vite-plugin-gtag',
		transformIndexHtml(html, ctx) {
			if (!gtagId) return html;

			const gtagScript = `
        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=${gtagId}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${gtagId}');
        </script>
      `;
			console.log('Injecting gtag script:', gtagId);
			return html.replace('</head>', `${gtagScript}</head>`);
		},
	};
}
