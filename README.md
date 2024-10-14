# axios-zod-gen

This package allows you to easily create strongly-typed API functions with runtime validation. Which is based on [Axios](https://axios-http.com/docs/intro) and [Zod](https://zod.dev/)

## Features

- **Typed API functions**: Automatically generates Axios functions based on your configuration.
- **Zod Integration**: Supports Zod schemas for path parameters, query parameters, request bodies, and response validation.
- **Customizable**: Use a default or custom Axios instance for your API requests.

## Usage

### Generating API Functions

You can generate multiple API functions based on a configuration object by using `initApiFunctions`.
This allows you to create a set of typed and validated API calls.

```ts
import { initApiFunctions } from 'axios-zod-gen';
import { z } from 'zod';

const configs = {
  getUser: {
    method: 'get',
    url: '/user/:id',
    pathParamSchema: z.object({ id: z.string() }),
    returnSchema: z.object({ id: z.string(), name: z.string() }),
  },
  updateUser: {
    method: 'post',
    url: '/user/:id',
    pathParamSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ name: z.string() }),
  },
};

const api = initApiFunctions(configs);

// Usage:
async function fetchUser() {
  const response = await api.getUser({ id: '123' });
  console.log(response.data); // { id: '123', name: 'John Doe' }
}

async function saveUser() {
  const response = await api.updateUser({ id: '123', name: 'Jane Doe' });
  console.log(response.data);
}
```

### Creating Individual API Functions

If you only need to create a single API function, you can use `createApiFunction` directly.

```ts
import { createApiFunction } from 'axios-zod-gen';
import { z } from 'zod';

const getUser = createApiFunction({
  method: 'get',
  url: '/user/:id',
  pathParamSchema: z.object({ id: z.string() }),
  returnSchema: z.object({ id: z.string(), name: z.string() }),
});

// Usage:
const user = await getUser({ id: '123' });
console.log(user.data); // { id: '123', name: 'John Doe' }
```

## License

This project is licensed under the MIT License.
