import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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

  it('can execute', async () => {
    const find = vi.fn(() => mockApis.find({}));
    const result = await find();

    expect(find).toBeCalled();
    expect(result).toBeDefined();
  });
});

describe('`findById` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('findById');
    expect(mockApis.findById).toBeDefined();
  });

  it('can execute', async () => {
    const findById = vi.fn(() => mockApis.findById({ id: '1' }));
    const result = await findById();

    expect(findById).toBeCalled();
    expect(result).toBeDefined();
  });
});

describe('`add` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('add');
    expect(mockApis.add).toBeDefined();
  });

  it('can execute', async () => {
    const add = vi.fn(() => mockApis.add({
      name: 'testing',
      color: 'red',
      price: 10,
      quantity: 1,
      unit: 'Piece',
    }));
    const result = await add();

    expect(add).toBeCalled();
    expect(result).toBeDefined();
  });
});

describe('`update` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('update');
    expect(mockApis.update).toBeDefined();
  });

  it('can execute', async () => {
    const update = vi.fn(() => mockApis.update({ id: '1' }, { name: 'new name' }));
    const result = await update();

    expect(update).toBeCalled();
    expect(result).toBeDefined();
  });
});

describe('`remove` function', () => {
  it('exist', () => {
    expect(mockApis).toHaveProperty('remove');
    expect(mockApis.remove).toBeDefined();
  });

  it('can execute', async () => {
    const remove = vi.fn(() => mockApis.remove({ id: '1' }));
    const result = await remove();

    expect(remove).toBeCalled();
    expect(result).toBeDefined();
  });
});
