const http = require('http');

const database = {
  products: {},
};

const ensureId = (id) => id || Math.floor(Math.random() * 100000);

const parseBody = async (request) => {
  const bodyBuffer = [];

  for await (const chunk of request) {
    bodyBuffer.push(chunk);
  }

  return Buffer.concat(bodyBuffer).toString('utf-8');
};

const routes = [
  {
    name: 'Create Product',
    method: 'POST',
    path: '/products',
    async handler(request, response) {
      const body = await parseBody(request);
      const product = JSON.parse(body);

      product.id = ensureId(product.id);

      database.products[product.id] = product;

      response.writeHead(201, {
        'Content-Type': 'application/json',
        Location: `http://${request.headers.host}${this.path}/${product.id}`,
      });

      response.write(JSON.stringify(product));

      return response.end();
    },
  },
  {
    name: 'Get Product',
    method: 'GET',
    path: new RegExp('/products/(?<id>[^/]*)'),
    async handler(request, response) {
      const params = this.path.exec(request.url)?.groups;
      const product = database.products[params.id];

      if (!product) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Product not found' }));
        return response.end();
      }

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(product));
      return response.end();
    },
  },
];

const server = http.createServer(async (request, response) => {
  console.log(`${request.method} | ${request.url}`);

  const matchedRoute = routes.find((route) => {
    if (route.method !== request.method) return false;

    return route.path instanceof RegExp
      ? route.path.test(request.url)
      : route.path === request.url;
  });

  if (!matchedRoute) {
    console.log(`route not found`);
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Not Found' }));
    return response.end();
  }

  try {
    console.log(`called route: ${matchedRoute.name}`);
    await matchedRoute.handler(request, response);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Internal Server Error' }));
    return response.end();
  }
});

server.listen(3000, () => console.log('api listen on 3000'));
