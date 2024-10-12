import type { IConfig, IConfigs, IDelete, IGet, IPatch, IPost, IPut } from './config';
import type { AxiosResponse } from 'axios';
import type { z, ZodType } from 'zod';

/** Makes an API call based on provided arguments, returning a promise with the result.
 *
 * Argument pattern is determined by the types of path parameters (P), query parameters (Q), and request body (B):
 * @returns A promise that resolves with the Axios response.
 */
type ApiFunctionBase<P = undefined, Q = undefined, B = undefined, R = any> = (
  ...args:
  P extends undefined
    ? Q extends undefined
      ? B extends undefined ? [] : [body: B]
      : B extends undefined ? [query: Q] : [query: Q, body: B]
    : Q extends undefined
      ? B extends undefined ? [pathParam: P] : [pathParam: P, body: B]
      : B extends undefined ? [pathParam: P, query: Q] : [pathParam: P, query: Q, body: B]
) => Promise<AxiosResponse<R, any>>;

type InferOrUndefined<T extends ZodType | undefined> = T extends ZodType ? z.infer<T> : undefined;

type ApiFunctionPQB<T extends IConfig> = T['pathParamSchema'] extends ZodType
  ? T['querySchema'] extends ZodType
    ? T['bodySchema'] extends ZodType
      ? ApiFunctionBase<z.infer<T['pathParamSchema']>, z.infer<T['querySchema']>, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
      : ApiFunctionBase<z.infer<T['pathParamSchema']>, z.infer<T['querySchema']>, undefined, InferOrUndefined<T['returnSchema']>>
    : T['bodySchema'] extends ZodType
      ? ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
      : ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, undefined, InferOrUndefined<T['returnSchema']>>
  : T['querySchema'] extends ZodType
    ? T['bodySchema'] extends ZodType
      ? ApiFunctionBase<undefined, z.infer<T['querySchema']>, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
      : ApiFunctionBase<undefined, z.infer<T['querySchema']>, undefined, InferOrUndefined<T['returnSchema']>>
    : T['bodySchema'] extends ZodType
      ? ApiFunctionBase<undefined, undefined, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
      : ApiFunctionBase<undefined, undefined, undefined, InferOrUndefined<T['returnSchema']>>;

type ApiFunctionPQ<T extends IConfig> = T['pathParamSchema'] extends ZodType
  ? T['querySchema'] extends ZodType
    ? ApiFunctionBase<z.infer<T['pathParamSchema']>, z.infer<T['querySchema']>, undefined, InferOrUndefined<T['returnSchema']>>
    : ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, undefined, InferOrUndefined<T['returnSchema']>>
  : T['querySchema'] extends ZodType
    ? ApiFunctionBase<undefined, z.infer<T['querySchema']>, undefined, InferOrUndefined<T['returnSchema']>>
    : ApiFunctionBase<undefined, undefined, undefined, InferOrUndefined<T['returnSchema']>>;

type ApiFunctionPB<T extends IConfig> = T['pathParamSchema'] extends ZodType
  ? T['bodySchema'] extends ZodType
    ? ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
    : ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, undefined, InferOrUndefined<T['returnSchema']>>
  : T['bodySchema'] extends ZodType
    ? ApiFunctionBase<undefined, undefined, z.infer<T['bodySchema']>, InferOrUndefined<T['returnSchema']>>
    : ApiFunctionBase<undefined, undefined, undefined, InferOrUndefined<T['returnSchema']>>;

type ApiFunctionP<T extends IConfig> = T['pathParamSchema'] extends ZodType
  ? ApiFunctionBase<z.infer<T['pathParamSchema']>, undefined, undefined, InferOrUndefined<T['returnSchema']>>
  : ApiFunctionBase<undefined, undefined, undefined, InferOrUndefined<T['returnSchema']>>;

/** Maps the API function type based on the provided configuration.
 * - get -> pathParam, query
 * - post -> pathParam, query, body
 * - patch -> pathParam, body
 * - put -> pathParam, body
 * - delete -> pathParam
 */
export type ApiFunctionMapper<T extends IConfig> =
  T extends IGet ? ApiFunctionPQ<T>
    : T extends IPost ? ApiFunctionPQB<T>
      : T extends IPatch | IPut ? ApiFunctionPB<T>
        : T extends IDelete ? ApiFunctionP<T>
          : never;

/** An object where each key corresponds to an API function, based on the provided configuration.
 *
 * Each API function is generated using the ApiFunctionMapper, which maps configuration properties
 * such as method (GET, POST, PUT, etc.) to the appropriate function type.
 */
export type ApiFunctionsObj<T extends IConfigs> = {
  [K in keyof T]: ApiFunctionMapper<T[K]>
};
