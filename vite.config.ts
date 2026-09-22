import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import { VitePluginHtml, VitePluginStyle, vitePluginGtag } from './src/plugins/html'
import removeConsole from 'vite-plugin-remove-console'
import { execSync } from 'child_process';
// 如果不通过js引入svg，可以通过这个插件来防止svg被打包进js中

function getGitBranch() {
	try {
		// 执行git branch命令，然后通过管道过滤当前分支
		const branchName = process.env.BRANCH_NAM || '';
		const commitId = execSync('git rev-parse HEAD')
			.toString()
			.trim();
		return branchName.toString().trim() + ' commitId:' + commitId;
	} catch (err) {
		console.error('无法获取git分支名称:', err);
		return null;
	}
}

/**
 * @description 判断是否在Jenkins环境中
 */
function isJenkins() {
	return !!process.env.JENKINS_HOME;
}

function normalizeModuleId(id: string) {
	return id.split('?')[0].replace(/\\/g, '/')
}
export default defineConfig(({ mode }) => {
	const AR_ENV = loadEnv(mode, path.resolve(__dirname, `./entrance/${process.env.NODE_ENV}/`));
	const sass = loadEnv(mode, path.resolve(__dirname));

	console.log("==================vite.config.ts=================");


	console.log('AR_ENV', {...AR_ENV, ...sass});
	const buildTime = new Date().toLocaleString();
	const branchName = getGitBranch();
	return {
		define: {
			'import.meta.env.VITE_SAAS_API_URL': `'${sass.VITE_SAAS_API_URL}'`,
			'import.meta.env.VITE_SAAS_JSON_URL': `'${sass.VITE_SAAS_JSON_URL}'`,
			'import.meta.env.VITE_BAST_URL': `'${sass.VITE_BAST_URL}'`,
			 "import.meta.env.VITE_WEBP":`'${sass.VITE_WEBP}'`
		},
		plugins: [
			vueJsx(),
			vue(),
			svgLoader(),
			VitePluginHtml('./src/assets/icons/svg/'),
			VitePluginStyle(),
			vitePluginGtag(AR_ENV.VITE_GTAG_ID),
			// sit 和开发环境保留 console，其他环境移除
			...(['sit', 'dev', 'development', 'prototype'].includes(mode) ? [] : [removeConsole()]),
		],
		css: {
			preprocessorOptions: {
				scss: {
					/*eslint-env es6*/
					additionalData: `@use "@/assets/styles/vars.scss" as *; @use "@/assets/styles/native.scss" as *;`
				}
			}
		},
		base: './',
		root: path.resolve(__dirname, `./entrance/${process.env.NODE_ENV}/`),
		envDir: path.resolve(__dirname, `./entrance/${process.env.NODE_ENV}/`),
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@icon': path.resolve(__dirname, `src/assets/${AR_ENV.VITE_MAINCOLOR}/icons`),
				'@public': path.resolve(__dirname, `src/assets/icons`),
				'@game': path.resolve(__dirname, 'src/saasLottery/game'),
				'@trx': path.resolve(__dirname, 'src/saasLottery/game/TrxWinGo'),

			}
		},
		server: {
			host: '0.0.0.0',
			hmr: true,
			port: 5190,
			cors: true,
			allowedHosts:true
		},
		build: {
			outDir: path.resolve(__dirname, 'dist'),
			emptyOutDir: true,
			sourcemap: false,
			chunkSizeWarningLimit: 200 /* 默认500kb 后面会进行分包处理*/,
			assetsInlineLimit: 0,
			dynamicImportVarsOptions: {
				include: ['**/src/**']
			},
			rollupOptions: {
				treeshake: {
					moduleSideEffects(id, external) {
						if (external) return true
						const moduleId = normalizeModuleId(id)

						// This Pixi-backed hook is re-exported from the hooks barrel, but it has no
						// required global side effects when none of its exports are used.
						if (moduleId.endsWith('/src/hooks/useTurntable.ts')) {
							return false
						}

						return true
					}
				},
				external(id) {
					if (id.includes('Style/icons')) {
						if (!id.includes(AR_ENV.VITE_MAINCOLOR + '/icons')) {
							return true
						}
					}
				},
				plugins: [
					{
						name: 'remove-console-warn',
						renderChunk(code) {
							// 移除 lib-flexible 中的 console.warn 语句
							return code.replace('将根据已有的meta标签来设置缩放比例', '');
						},
					},
				],
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					banner: (chunk: any) => {
						if (!chunk.isEntry) return '';
						return `window.getBuildInfo = function() {
						const buildTime = '${buildTime}';
						const branch = '${branchName}' || 'main';
						return {
							buildTime,
							branch
						};
					};`
					},
				}
			}
		}
	}
})
