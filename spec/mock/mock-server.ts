import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { db } from './mock-data';

import type { Fruit } from './mock-data';

export const baseUrl = 'https://axios-zod-gen.com';
export const MockUrl = {
  FIND: '/fruit',
  FINDBYID: '/fruit/:id',
  ADD: '/fruit',
  UPDATE: '/fruit/:id',
  REMOVE: '/fruit/:id',
} as const;
function genUrl(endPoint: typeof MockUrl[keyof typeof MockUrl]) {
  return new URL(endPoint, baseUrl).toString();
}

export const restHandlers = [
  http.get(genUrl(MockUrl.FIND), ({ request }) => {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') ?? '3');
    const offset = Number.parseInt(searchParams.get('offset') ?? '0');
    const filterName = searchParams.get('name');
    const query: Parameters<typeof db.fruit.findMany>[0] = { skip: offset, take: limit };
    if (filterName) {
      query.where = { name: { contains: filterName } };
    }
    const result = db.fruit.findMany(query);

    return HttpResponse.json(result);
  }),

  http.get(genUrl(MockUrl.FINDBYID), ({ params }) => {
    const id = params.id as string;
    const result = db.fruit.findFirst({ where: { id: { equals: id } } });

    return HttpResponse.json(result);
  }),

  http.post<never, Omit<Fruit, 'id'>>(genUrl(MockUrl.ADD), async ({ request }) => {
    const b = await request.json();
    const [lastItem] = db.fruit.findMany({ orderBy: { id: 'desc' }, take: 1 });
    const result = db.fruit.create({
      ...b,
      id: (Number.parseInt(lastItem.id) + 1).toString(),
    });

    return HttpResponse.json(result, {
      status: 201,
    });
  }),

  http.patch<{ id: string }, Omit<Fruit, 'id'>>(genUrl(MockUrl.UPDATE), async ({ params, request }) => {
    const b = await request.json();
    const id = params.id as string;
    db.fruit.update({
      where: { id: { equals: id } },
      data: b,
    });

    return HttpResponse.json(undefined, { status: 204 });
  }),

  http.delete<{ id: string }>(genUrl(MockUrl.REMOVE), ({ params }) => {
    const id = params.id as string;
    db.fruit.delete({ where: { id: { equals: id } } });

    return HttpResponse.json(undefined, { status: 204 });
  }),
];

export const server = setupServer(...restHandlers);
