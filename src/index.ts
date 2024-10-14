import axios from 'axios';
import { mapValues, pipe } from 'remeda';

import { createApiFunction } from './create-api-function';

import type { ApiFunctionsObj, IConfig, IConfigs } from './type';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

/** Creates a set of Axios functions based on the provided configuration.
 *
 * Initialize an Axios instance and generates corresponding
 * API functions for each configuration entry.
 *
 * @param configs - An object containing the configurations for the Axios functions.
 * @param instanceConfig - Optional configuration settings for the Axios instance.
 * @returns An object containing the generated Axios functions.
 */
function initApiFunctions<T extends IConfigs>(configs: T, instanceConfig?: CreateAxiosDefaults): ApiFunctionsObj<T>;
/** Creates a set of Axios functions based on the provided configuration.
 *
 * Get more control and flexibility by passing a custom Axios instance.
 *
 * @param configs - An object containing the configurations for the Axios functions.
 * @param instance - An optional custom Axios instance.
 * @returns An object containing the generated Axios functions.
 */
function initApiFunctions<T extends IConfigs>(configs: T, instance?: AxiosInstance): ApiFunctionsObj<T>;
function initApiFunctions<T extends IConfigs>(
  configs: T,
  arg: CreateAxiosDefaults | AxiosInstance = {}
) {
  let instance: AxiosInstance;

  if (arg && (arg as AxiosInstance).request) {
    instance = arg as AxiosInstance;
  }
  else {
    instance = axios.create(arg as CreateAxiosDefaults);
  }

  const apiFunctions = pipe(
    configs,
    mapValues((config) => createApiFunction(config as IConfig, instance))
  );

  // Use 'as unknown' to bypass type checks for proper type conformance.
  return apiFunctions as unknown as ApiFunctionsObj<T>;
};

export type { IConfig, IConfigs };
export { createApiFunction, initApiFunctions };
export default initApiFunctions;
