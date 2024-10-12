import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { mockApis } from './mock/mock-apis';
import { resetMockData, server } from './mock/mock-server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  resetMockData();
  server.restoreHandlers();
});
afterAll(() => server.close());

it('mockApis existing', () => {
  expect(mockApis).toBeDefined();
  expect(Object.keys(mockApis)).toHaveLength(5);
});

describe('`find` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('find');
    expect(mockApis.find).toBeDefined();
  });
});

describe('`findById` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('findById');
    expect(mockApis.findById).toBeDefined();
  });
});

describe('`add` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('add');
    expect(mockApis.add).toBeDefined();
  });
});

describe('`update` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('update');
    expect(mockApis.update).toBeDefined();
  });
});

describe('`delete` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('remove');
    expect(mockApis.remove).toBeDefined();
  });
});
