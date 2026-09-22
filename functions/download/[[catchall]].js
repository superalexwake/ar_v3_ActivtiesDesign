/**
 * R2 静态资源下载代理（Cloudflare Pages Function）。
 *
 * 路由：/download/<path>
 * 行为：把 R2 桶 (binding: env.apk) 里的 <path> 透传出去，主要给 APK / APK 包及附属资源下载用。
 *
 * 支持的特性：
 *   - GET / HEAD：HEAD 只返回 headers
 *   - Range 请求：支持 `Range: bytes=N-` / `bytes=N-M`，返回 206 + Content-Range
 *   - ETag 协商：`If-None-Match` 命中返回 304
 *   - filename 编码：Content-Disposition 用 RFC 5987 `filename*=UTF-8''...`，兼容中文 / 空格
 *   - 缓存：APK 设较长 max-age；其它资源 1 小时
 *
 * 不支持：HTTP method 除 GET/HEAD 外一律 405。
 */

// 模块加载时定义一次，避免每个请求重复创建
const MIME_TYPES = {
	txt: 'text/plain; charset=utf-8',
	html: 'text/html; charset=utf-8',
	css: 'text/css; charset=utf-8',
	js: 'application/javascript; charset=utf-8',
	json: 'application/json; charset=utf-8',
	xml: 'application/xml; charset=utf-8',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	svg: 'image/svg+xml',
	webp: 'image/webp',
	ico: 'image/x-icon',
	pdf: 'application/pdf',
	zip: 'application/zip',
	apk: 'application/vnd.android.package-archive',
	aab: 'application/octet-stream',
	mp3: 'audio/mpeg',
	mp4: 'video/mp4',
	woff: 'font/woff',
	woff2: 'font/woff2',
	ttf: 'font/ttf',
}

const DEFAULT_MIME = 'application/octet-stream'

// APK 这种大文件给较长缓存；其它资源 1 小时
const CACHE_MAX_AGE = {
	apk: 86400,        // 1 天
	aab: 86400,
	default: 3600,     // 1 小时
}

function getExt(filename) {
	const i = filename.lastIndexOf('.')
	return i === -1 ? '' : filename.slice(i + 1).toLowerCase()
}

function getContentType(filename) {
	return MIME_TYPES[getExt(filename)] || DEFAULT_MIME
}

function getMaxAge(filename) {
	return CACHE_MAX_AGE[getExt(filename)] ?? CACHE_MAX_AGE.default
}

/**
 * RFC 5987：包含非 ASCII 字符的文件名，必须用 filename*= 形式。
 * 同时保留 ASCII fallback `filename=`，给老客户端兜底。
 */
function buildContentDisposition(filename) {
	const asciiFallback = filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '\\"')
	const encoded = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, '%2A')
	return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}

/**
 * 解析 Range 头。
 * 只支持单一区间形式：`bytes=N-`、`bytes=N-M`、`bytes=-M`（最后 M 字节）。
 * 不支持多区间（multipart/byteranges）—— 几乎没人发，复杂度跟收益不成正比。
 *
 * @returns { offset, length } | null（未指定 / 无效）
 */
function parseRange(rangeHeader, totalSize) {
	if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null

	const spec = rangeHeader.slice(6).trim()
	if (spec.includes(',')) return null  // 多区间不支持

	const [startStr, endStr] = spec.split('-')

	if (startStr === '' && endStr !== '') {
		// bytes=-M  最后 M 字节
		const suffix = Number.parseInt(endStr, 10)
		if (!Number.isFinite(suffix) || suffix <= 0) return null
		const length = Math.min(suffix, totalSize)
		return { offset: totalSize - length, length }
	}

	const start = Number.parseInt(startStr, 10)
	if (!Number.isFinite(start) || start < 0 || start >= totalSize) return null

	if (endStr === '' || endStr === undefined) {
		// bytes=N-
		return { offset: start, length: totalSize - start }
	}

	const end = Number.parseInt(endStr, 10)
	if (!Number.isFinite(end) || end < start) return null
	const clampedEnd = Math.min(end, totalSize - 1)
	return { offset: start, length: clampedEnd - start + 1 }
}

// =============================================================================
// 路径首段（tenant）映射：纯数字 → R2 桶里实际的目录名。
// 字符串首段（例如 'ar001' / 'sit'）跳过映射直接用。
// TODO: 完整映射表由项目方维护。下表只是已知 2 条，看到 console.warn 提示就在这里补。
// =============================================================================
const TENANT_NUMBER_MAP = {
	2001: 'sit',
}

function resolveTenant(segment) {
	if (/^\d+$/.test(segment)) {
		const mapped = TENANT_NUMBER_MAP[Number.parseInt(segment, 10)]
		if (!mapped) {
			console.warn('[download] unknown numeric tenant', segment)
			return null
		}
		return mapped
	}
	return segment
}

/**
 * 处理 `?version=` 参数：把路径里的文件名拆 `<name><ext>` 后拼成 `<name>-<version><ext>`。
 *
 *   rest = 'full.apk',     version = '2.0.0' → 'full-2.0.0.apk'
 *   rest = 'dir/full.apk', version = '2.0.0' → 'dir/full-2.0.0.apk'
 *   rest = 'noext',        version = '2.0.0' → 'noext-2.0.0'
 *   rest = '',             version = '2.0.0' → null（路径里没文件名，没法拼）
 */
function applyVersion(rest, version) {
	if (!rest) return null
	const lastSlash = rest.lastIndexOf('/')
	const dir = lastSlash === -1 ? '' : rest.slice(0, lastSlash + 1)
	const filename = lastSlash === -1 ? rest : rest.slice(lastSlash + 1)
	if (!filename) return null
	const dot = filename.lastIndexOf('.')
	const name = dot === -1 ? filename : filename.slice(0, dot)
	const ext = dot === -1 ? '' : filename.slice(dot)
	return `${dir}${name}-${version}${ext}`
}

export async function onRequest(context) {
	const { env, params, request } = context

	// 1. HTTP method 限制
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response('Method not allowed', {
			status: 405,
			headers: { Allow: 'GET, HEAD' },
		})
	}

	// 2. 路径校验
	const raw = Array.isArray(params.catchall) ? params.catchall.join('/') : params.catchall
	if (!raw || raw.endsWith('/')) {
		return new Response('Path not found', { status: 404 })
	}

	let decoded
	try {
		decoded = decodeURIComponent(raw)
	} catch {
		return new Response('Invalid path', { status: 400 })
	}

	// 防 path traversal / null byte（R2 是 key-value，但避免奇怪输入）
	if (decoded.includes('..') || decoded.includes('\0')) {
		return new Response('Invalid path', { status: 400 })
	}

	// 3. 解析 tenant 首段；数字按映射表转 → R2 实际目录名
	const firstSlash = decoded.indexOf('/')
	const tenantRaw = firstSlash === -1 ? decoded : decoded.slice(0, firstSlash)
	const restRaw = firstSlash === -1 ? '' : decoded.slice(firstSlash + 1)

	const tenant = resolveTenant(tenantRaw)
	if (!tenant) {
		return new Response('Unknown tenant', { status: 404 })
	}

	// 4. ?version=xxx 时把路径里的文件名拼成 <name>-<version><ext>
	const version = new URL(request.url).searchParams.get('version')
	let rest = restRaw
	if (version) {
		const replaced = applyVersion(restRaw, version)
		if (!replaced) {
			return new Response('Path not found', { status: 404 })
		}
		rest = replaced
	}

	if (!rest) {
		return new Response('Path not found', { status: 404 })
	}
	let objectKey = `${tenant}/${rest}`

	// 5. HEAD：只取 metadata，不拉 body
	const isHead = request.method === 'HEAD'

	let head
	try {
		head = await env.apk.head(objectKey)
	} catch (err) {
		console.error('[download] R2 head error', objectKey, err)
		return new Response('Storage error', { status: 502 })
	}

	// Fallback：?version= 拼出来的文件没找到 → 回退到原始（无 version）文件
	if (!head && version) {
		const fallbackKey = `${tenant}/${restRaw}`
		if (fallbackKey !== objectKey) {
			try {
				head = await env.apk.head(fallbackKey)
				if (head) objectKey = fallbackKey
			} catch (err) {
				console.error('[download] R2 head fallback error', fallbackKey, err)
				return new Response('Storage error', { status: 502 })
			}
		}
	}

	if (!head) {
		return new Response('File not found', { status: 404 })
	}

	const filename = objectKey.split('/').pop() || 'download'
	const contentType = getContentType(filename)
	const totalSize = head.size
	const etag = head.etag

	// 4. ETag 协商 304
	const ifNoneMatch = request.headers.get('If-None-Match')
	if (ifNoneMatch && ifNoneMatch === etag) {
		return new Response(null, {
			status: 304,
			headers: {
				ETag: etag,
				'Cache-Control': `public, max-age=${getMaxAge(filename)}`,
			},
		})
	}

	// 5. Range 请求
	const rangeHeader = request.headers.get('Range')
	const range = rangeHeader ? parseRange(rangeHeader, totalSize) : null

	if (rangeHeader && !range) {
		// 头存在但解析失败 → 416 Range Not Satisfiable
		return new Response('Range not satisfiable', {
			status: 416,
			headers: { 'Content-Range': `bytes */${totalSize}` },
		})
	}

	const baseHeaders = {
		'Content-Type': contentType,
		'Content-Disposition': buildContentDisposition(filename),
		ETag: etag,
		'Accept-Ranges': 'bytes',
		'Cache-Control': `public, max-age=${getMaxAge(filename)}`,
		'Last-Modified': head.uploaded ? new Date(head.uploaded).toUTCString() : undefined,
	}
	// 删 undefined 字段
	Object.keys(baseHeaders).forEach(k => baseHeaders[k] === undefined && delete baseHeaders[k])

	// HEAD：只返回 headers，body 为 null
	if (isHead) {
		return new Response(null, {
			status: range ? 206 : 200,
			headers: {
				...baseHeaders,
				'Content-Length': (range ? range.length : totalSize).toString(),
				...(range && {
					'Content-Range': `bytes ${range.offset}-${range.offset + range.length - 1}/${totalSize}`,
				}),
			},
		})
	}

	// 6. GET：拉 body（必要时带 range）
	let object
	try {
		object = range
			? await env.apk.get(objectKey, { range: { offset: range.offset, length: range.length } })
			: await env.apk.get(objectKey)
	} catch (err) {
		console.error('[download] R2 get error', objectKey, err)
		return new Response('Storage error', { status: 502 })
	}
	if (!object) {
		// head 命中但 get 没拿到，可能并发删除
		return new Response('File not found', { status: 404 })
	}

	if (range) {
		return new Response(object.body, {
			status: 206,
			headers: {
				...baseHeaders,
				'Content-Length': range.length.toString(),
				'Content-Range': `bytes ${range.offset}-${range.offset + range.length - 1}/${totalSize}`,
			},
		})
	}

	return new Response(object.body, {
		status: 200,
		headers: {
			...baseHeaders,
			'Content-Length': totalSize.toString(),
		},
	})
}
