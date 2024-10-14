import axios from 'axios';
import { z } from 'zod';

import { initApiFunctions } from '../../src';

import { baseUrl, MockUrl } from './mock-server';

import type { IConfigs } from '../../src';

const mockDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int(),
  quantity: z.number().int(),
  color: z.string(),
  unit: z.string(),
});

const idPathSchema = z.object({ id: z.string() });

const findQuerySchema = mockDataSchema.pick({
  name: true,
}).extend({
  limit: z.number().int(),
  offset: z.number().int(),
}).partial();

export interface MockDataType extends z.infer<typeof mockDataSchema> {}
export interface IdPathType extends z.infer<typeof idPathSchema> {}
export interface FindQueryType extends z.infer<typeof findQuerySchema> {}

const apiFunctionsConfig = {
  findById: {
    method: 'get',
    url: MockUrl.FINDBYID,
    pathParamSchema: idPathSchema,
    returnSchema: mockDataSchema,
  },
  find: {
    method: 'get',
    url: MockUrl.FIND,
    querySchema: findQuerySchema,
    returnSchema: mockDataSchema.array(),
  },
  findWithWrongSchema: {
    method: 'get',
    url: MockUrl.FIND,
    querySchema: findQuerySchema,
    returnSchema: mockDataSchema.extend({ wrong: z.string() }).array(),
  },
  add: {
    method: 'post',
    url: MockUrl.ADD,
    bodySchema: mockDataSchema.omit({ id: true }),
    returnSchema: mockDataSchema,
  },
  update: {
    method: 'patch',
    url: MockUrl.UPDATE,
    pathParamSchema: idPathSchema,
    bodySchema: mockDataSchema.omit({ id: true }).partial(),
  },
  remove: {
    method: 'delete',
    url: MockUrl.REMOVE,
    pathParamSchema: idPathSchema,
  },
} satisfies IConfigs;

export const mockApis = initApiFunctions(apiFunctionsConfig, { baseURL: baseUrl });
export const mockApisWithCustomInstance = initApiFunctions(apiFunctionsConfig, axios.create({ baseURL: baseUrl }));
