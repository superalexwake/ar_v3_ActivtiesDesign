import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios'
import { isFunction, isString,throttle,debounce } from './util'
import { stringify } from 'qs'
import { ContentType } from './constants'
import {AxiosRequestConfigRetry, AxiosUrl, InterceptorAxiosRequestConfig, RequestOptions, Result} from './type'
import { AxiosCanceler } from './AxiosCancel'
import { CreateAxiosOptions } from './AxiosTransform'
export class VAxios {

  private instance: AxiosInstance

  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.instance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * 创建Axios实例
   * @param config
   * @private
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.instance = axios.create(config)
  }

  /**
   * 获取数据处理类
   * @private
   */
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * 获取Axios实例
   */
  getAxios(): AxiosInstance {
    return this.instance
  }

  /**
   * 配置Axios
   * @param config
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.instance) return
    this.createAxios(config)
  }

  /**
   * 设置公共头部信息
   * @param headers
   */
  setHeader(headers: Record<string, string>): void {
    if (!this.instance) return
    Object.assign(this.instance.defaults.headers, headers)
  }

  /**
   * 设置拦截器
   * @private
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) return

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform
    const axiosCanceler = new AxiosCanceler()

    // 请求拦截器
    this.instance.interceptors.request.use((config) => {

      const { ignoreCancelToken } = (config as InterceptorAxiosRequestConfig).requestOptions
      const ignoreCancel = ignoreCancelToken ?? this.options.requestOptions?.ignoreCancelToken
      if (!ignoreCancel) axiosCanceler.addPending(config)
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options) as InterceptorAxiosRequestConfig
      }
       return config
    }, undefined)

    // 请求错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.instance.interceptors.request.use(undefined, requestInterceptorsCatch)
    }

    // 响应结果处理
    this.instance.interceptors.response.use((res: AxiosResponse) => {
      if (res) axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.instance.interceptors.response.use(undefined, (error) =>
        responseInterceptorsCatch(error, this.instance),
      )
    }
  }

  /**
   * 支持 FormData 请求格式
   * @param config
   */
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || (this.options.headers as AxiosRequestHeaders)
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentType.FormURLEncoded ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

 private getOptions(url: AxiosUrl) {
    const config = isString(url) ? { url } : url
    return config as AxiosRequestConfig
  }
  get<T = any,D = any>(url: AxiosUrl,params?: D, options?: RequestOptions) {
    return this.request<T>(Object.assign({ method: 'GET' ,params},this.getOptions(url)), options)
  }

  post<T = any, D = any>(url:AxiosUrl, data?: D, options?: RequestOptions) {
    return this.request<T>(Object.assign({ method: 'POST',data },this.getOptions(url)), options)
  }

  put<T = any, D = any>(url: AxiosUrl, data?: D, options?: RequestOptions) {
    return this.request<T>(Object.assign({ method: 'PUT',data },this.getOptions(url)), options)
  }

  delete<T = any, D = any>(url: AxiosUrl, data?: D, options?: RequestOptions) {
    return this.request<T>(Object.assign({ method: 'DELETE',data },this.getOptions(url)), options)
  }

  patch<T = any, D = any>(url: AxiosUrl, data?: D, options?: RequestOptions) {
    return this.request<T>(Object.assign({ method: 'PATCH',data },this.getOptions(url)), options)
  }

  upload<T = any>(url: AxiosUrl, data?: FormData, options?: RequestOptions) {
    return this.request<T>(
        Object.assign({
        method: 'POST',
        headers: {
          'Content-Type': ContentType.FormData,
        },
        data,
      },this.getOptions(url)),
      options,
    )
  }

  /**
   * 请求封装
   * @param config
   * @param options
   */
  request<T = any>(config: AxiosRequestConfigRetry, options?: RequestOptions): Promise<Result<T>> {
    const { requestOptions = {} as RequestOptions } = this.options
    if (requestOptions.throttle !== undefined && requestOptions.debounce !== undefined) {
      throw new Error('throttle and debounce cannot be set at the same time')
    }
    const throttleOptions = requestOptions.throttle || ({} as Required<RequestOptions>['throttle'])
    const debounceOptions:RequestOptions['debounce'] = requestOptions.debounce || ({} as Required<RequestOptions>['debounce'])
    if (requestOptions.throttle && requestOptions.throttle.delay !== 0) {
      return new Promise((resolve) => {
        throttle(() => resolve(this.synthesisRequest(config, options)), throttleOptions?.delay)
      })
    }

    if (requestOptions.debounce && requestOptions.debounce.delay !== 0) {
      return new Promise((resolve) => {
        debounce(() => resolve(this.synthesisRequest(config, options)), debounceOptions?.delay)
      })
    }
    return this.synthesisRequest(config, options)
  }

  /**
   * 请求方法
   * @private
   */
  private async synthesisRequest<T = any>(
    config: AxiosRequestConfigRetry,
    options?: RequestOptions,
  ): Promise<T> {
    let conf: CreateAxiosOptions = config
    const transform = this.getTransform()

    const { requestOptions={} } = this.options

    const opt: RequestOptions = { ...requestOptions, ...options }

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt
    conf = this.supportFormData(conf)
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(!requestOptions.retry ? conf : config)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('请求错误!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // 在这里重写Axios的错误信息
          }
          reject(e)
        })
    })
  }
}
