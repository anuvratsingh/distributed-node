import fastify from 'fastify';

import fastifyGQL from 'fastify-gql';

import grpc = require('@grpc/grpc-js');
import loader = require('@grpc/proto-loader');

import fs = require('fs');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;

const server = fastify();
// JSON over HTTP

{
//console.log(`worker pid=${process.pid}`);
// const server = fastify({
//   https: {
//     key: fs.readFileSync(__dirname + '/../tls/producer-private-key.key'),
//     cert: fs.readFileSync(
//       __dirname + '/../../shared/tls/producer-certificate.cert'
//     ),
//   },
// });

// server.get('/recipes/:id', async (req: any, res) => {
//   console.log(`worker request pid=${process.pid}`);
//   const id = Number(req.params.id);
//   if (id !== 42) {
//     res.statusCode = 404;
//     return { error: 'not_found' };
//   }
//   return {
//     producer_pid: process.pid,
//     recipe: {
//       id,
//       name: 'Chicken Tikka Masala',
//       steps: 'Into the pot...',
//       ingredients: [
//         {
//           id: 1,
//           name: 'Chicken',
//           quantity: '1 lb',
//         },
//         {
//           id: 2,
//           name: 'Sauce',
//           quantity: '2 cups',
//         },
//       ],
//     },
//   };
// });

// server.listen(PORT, HOST, () => {
//   console.log(`Producer recipe-API running at https://${HOST}:${PORT}`);
// });
}

// GraphQL
{
  const graphql = fastifyGQL;
  const schema = fs
    .readFileSync(__dirname + '/../../shared/src/graphql-schema.gql')
    .toString();

  const resolvers = {
    Query: {
      pid: () => process.pid,
      recipe: async (_obj, { id }) => {
        if (id != 42) throw new Error(`recipe ${id} not found`);
        return {
          id,
          name: 'Chicken Tikka Masala',
          steps: 'Into the pot...',
        };
      },
    },
    Recipe: {
      ingredients: async (obj) => {
        return obj.id != 42
          ? []
          : [
              { id: 1, name: 'Chicken', quantity: '1 lb' },
              { id: 2, name: 'Sauce', quantity: '2 cups' },
            ];
      },
    },
  };

  server
    .register(graphql, { schema, resolvers, graphiql: true })
    .listen(PORT, HOST, () => {
      console.log(
        `Producer recipe-graphQL-API running at http://${HOST}:${PORT}/graphql`
      );
    });
}
