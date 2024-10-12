import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import md from './mock-data.json';

let mockData = [...md];
export const resetMockData = () => {
  mockData = [...md];
};

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

    const result = mockData
      .filter(({ name }) => !filterName || name.includes(filterName))
      .slice(offset, offset + limit);
    return HttpResponse.json(result);
  }),

  http.get(genUrl(MockUrl.FINDBYID), ({ params }) => {
    const result = mockData.find(({ id }) => id === params.id);
    return HttpResponse.json(result);
  }),

  http.post<never, Omit<typeof mockData[number], 'id'>>(genUrl(MockUrl.ADD), async ({ request }) => {
    const b = await request.json();

    const lastId = Number.parseInt(mockData.at(-1)?.id ?? '0');
    const result = { ...b, id: (lastId + 1).toString() };

    mockData.push(result);
    return HttpResponse.json(result, {
      status: 201,
    });
  }),

  http.patch<{ id: string }, Omit<typeof mockData[number], 'id'>>(genUrl(MockUrl.UPDATE), async ({ params, request }) => {
    const b = await request.json();

    const target = mockData.find(({ id }) => id === params.id);
    if (!target) {
      return HttpResponse.json({ message: 'target not found' }, {
        status: 404,
      });
    }

    const targetIndex = mockData.findIndex(({ id }) => id === params.id);
    const result = { ...target, ...b };
    mockData[targetIndex] = result;

    return HttpResponse.json(undefined, { status: 204 });
  }),

  http.delete<{ id: string }>(genUrl(MockUrl.REMOVE), ({ params }) => {
    const targetIndex = mockData.findIndex(({ id }) => id === params.id);

    mockData.splice(targetIndex, 1);
    return HttpResponse.json(undefined, { status: 204 });
  }),
];

export const server = setupServer(...restHandlers);
