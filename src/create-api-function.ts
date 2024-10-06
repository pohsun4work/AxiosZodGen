import axios from 'axios';

import type { ApiFunctionMapper, IConfig } from './type';
import type { AxiosInstance } from 'axios';

/** Generates an Axios function based on the provided configuration.
 *
 * @param config - The configuration object for the Axios function.
 * @param instance - An optional Axios instance to use for the requests.
 * @returns The generated Axios function that conforms to the specified configuration.
 */
function createApiFunction<T extends IConfig>(
  config: T,
  instance: AxiosInstance = axios.create()
) {
  let { method, url, pathParamSchema, querySchema, bodySchema, returnSchema, ...rest } = config;

  const axiosFunction = async (...args: any[]) => {
    // Extract parameters for the API call based on the config.
    // Depending on the presence of path parameters, query string and request body,
    // the arguments will be assigned accordingly from the 'args' variable.
    const pathParams = pathParamSchema ? pathParamSchema.parse(args.shift()) : undefined;
    const query = querySchema ? querySchema.parse(args.shift()) : undefined;
    const data = bodySchema ? bodySchema.parse(args.shift()) : undefined;

    if (pathParams) {
      url = url.replace(
        /\/:([\w\-]+)/g,
        (match, key) => pathParams[key] || match
      );
    }

    const instanceReturn = await instance({
      ...rest,
      method,
      url,
      params: query,
      data,
    });

    if (returnSchema) {
      const { success, data } = returnSchema.safeParse(instanceReturn.data);

      return {
        ...instanceReturn,
        data: success ? data : null,
      };
    }

    return instanceReturn;
  };

  return axiosFunction as ApiFunctionMapper<T>;
}

export { createApiFunction };
