import axios from 'axios';

import type { ApiFunctionMapper, IConfig } from './type';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ZodType } from 'zod';

/** Generates an Axios function based on the provided configuration.
 *
 * This function can also be used independently of `initApiFunctions`,
 * allowing generate individual API functions as needed.
 * ```
 * // example
 * import { z } from 'zod'
 * import { createApiFunction } from 'axios-zod-gen'
 *
 * const fooApi = createApiFunction({
 *   method: 'get',
 *   url: '/demo/:id',
 *   pathParamSchema: z.object({ id: z.string() })
 * });
 *
 * // where to use
 * const data = await fooApi({ id: 'demo' });
 * ```
 *
 * @param config - The configuration object for the Axios function.
 * @param instance - An optional Axios instance to use for the requests.
 * @returns The generated Axios function that conforms to the specified configuration.
 */
function createApiFunction<T extends IConfig>(
  config: T,
  instance: AxiosInstance = axios.create()
) {
  let { method, url, pathParamSchema, querySchema, bodySchema, ...rest } = config;

  instance.interceptors.response.use((res) => {
    const config = res.config as InternalAxiosRequestConfig & { returnSchema?: ZodType };
    try {
      if (config.returnSchema && res.data) {
        res.data = config.returnSchema.parse(res.data);
      }

      return res;
    }
    catch (error) {
      return Promise.reject(error);
    }
  });

  const axiosFunction = (...args: any[]) => {
    // Extract parameters for the API call based on the config.
    // Depending on the presence of path parameters, query string and request body,
    // the arguments will be assigned accordingly from the 'args' variable.
    const pathParams = pathParamSchema ? pathParamSchema.parse(args.shift()) : undefined;
    const query = querySchema ? querySchema.parse(args.shift()) : undefined;
    const data = bodySchema ? bodySchema.parse(args.shift()) : undefined;

    if (pathParams) {
      url = url.replace(
        /\/:([\w\-]+)/g,
        (match, key) => `/${pathParams[key] || match}`
      );
    }

    return instance({
      ...rest,
      method,
      url,
      params: query,
      data,
    });
  };

  return axiosFunction as ApiFunctionMapper<T>;
}

export { createApiFunction };
