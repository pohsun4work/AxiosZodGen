import axios from 'axios';
import { mapValues, pipe } from 'remeda';

import { createApiFunction } from './create-api-function';

import type { ApiFunctionsObj, IConfig, IConfigs } from './type';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

/** Creates a set of Axios functions based on the provided configuration.
 *
 * This function initializes an Axios instance with optional interceptors
 * and generates corresponding API functions for each configuration entry.
 *
 * @param configs - An object containing the configurations for the Axios functions.
 * @param instanceConfig - Optional configuration settings for the Axios instance.
 * @param interceptors - Optional array of interceptor functions to modify the Axios instance.
 * @returns A function that returns an object containing the generated Axios functions.
 */
const initApiFunctions = <T extends IConfigs>(
  configs: T,
  instanceConfig: CreateAxiosDefaults = {},
  interceptors: Array<(instance: AxiosInstance) => AxiosInstance> = []
) => {
  const instance = interceptors.reduce(
    (instance, interceptor) => interceptor(instance),
    axios.create({ ...instanceConfig })
  );

  const apiFunctions = pipe(
    configs,
    mapValues((config) => createApiFunction(config as IConfig, instance))
  );

  // Use 'as unknown' to bypass type checks for proper type conformance.
  return apiFunctions as unknown as ApiFunctionsObj<T>;
};

export { createApiFunction, initApiFunctions };
export default initApiFunctions;
