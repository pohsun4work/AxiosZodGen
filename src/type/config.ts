import type { AxiosRequestConfig } from 'axios';
import type { ZodObject, ZodType } from 'zod';

type IConfigBase = {
  /** HTTP method.
   *
   * Only `get`, `post`, `patch`, `put` and `delete` in version 1.0.0
   *
   * TODO: Plan to add more method in future
   */
  method: string;

  /** API URL
   *
   * The endpoint to be used for the API request.
   *
   * When the request includes path parameters, placeholders should be added to the URL in the format `/:${key}`,
   * where `key` corresponds to the parameter name.
   * For example, for a path parameter schema with a key `id`, URL should include `/:id`.
   */
  url: string;

  /** Schema for validating path parameters.
   *
   * Use Zod's `parse` to validate incoming data.
   *
   * While using this property, make sure to include placeholders in the URL for path parameters.
   * The placeholders should follow the format `/:${key}`, where `key` corresponds to the name of each path parameter.
   * For example, for a path parameter schema with a key `id`, URL should include `/:id`.
   */
  pathParamSchema?: ZodObject<any>;

  /** Schema for validating the request body.
   *
   * Use Zod's `parse` to validate incoming data.
   */
  bodySchema?: ZodType;

  /** Schema for validating query parameters.
   *
   * Use Zod's `parse` to validate incoming query data.
   */
  querySchema?: ZodType;

  /** Schema for validating the response.
   *
   * Use Zod's `parse` method to ensure the returned data is valid.
   */
  returnSchema?: ZodType;
} & Omit<AxiosRequestConfig, 'method' | 'url' | 'params' | 'data'>;
type IConfigWithoutQuery = IConfigBase & { querySchema?: never };
type IConfigWithoutBody = IConfigBase & { bodySchema?: never };

export type IGet = IConfigWithoutBody & { method: 'get' };
export type IPost = IConfigBase & { method: 'post' };
export type IPut = IConfigWithoutQuery & { method: 'put' };
export type IPatch = IConfigWithoutQuery & { method: 'patch' };
export type IDelete = IConfigWithoutBody & IConfigWithoutQuery & { method: 'delete' };

/** Union type for API configuration options.
 *
 * This type combines various HTTP method configurations (get, post, put, patch, delete)
 * with a base configuration, allowing for flexible API requests.
 */
export type IConfig = IGet | IPost | IPut | IPatch | IDelete;
/** A record type for API configuration files.
 *
 * Keys represent the names of API functions, mapping each function
 * to its corresponding API configuration options.
 *
 * Use `satisfies` to ensure correct type inference.
 * @example
 * ```
 * const fooConfigs = {
 *   findById: {
 *     method: 'get',
 *     url: '/foo/:id',
 *     pathParamSchema: z.object({ id: z.string() }),
 *     returnSchema: fooSchema,
 *   },
 *   update: {
 *     method: 'patch',
 *     url: '/foo/:id',
 *     pathParamSchema: z.object({ id: z.string() }),
 *     bodySchema: fooSchema.omit({ id: true }),
 *   }
 * } satisfies IConfigs;
 * const fooApis = initApiFunctions(fooConfigs, { baseURL: 'http://127.0.0.1' });
 * ```
 */
export type IConfigs = Record<string, IConfig>;
