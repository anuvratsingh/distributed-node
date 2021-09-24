import fastify from 'fastify';

import fastifyGQL from 'fastify-gql';

import grpc = require('@grpc/grpc-js');
import loader = require('@grpc/proto-loader');

import fs = require('fs');
import { cpus } from "os";
import * as cluster from "cluster";

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;

// JSON over HTTP
// producer-http-basic.js

{
  console.log(`worker pid=${process.pid}`);
  const server = fastify({
    https: {
      key: fs.readFileSync(__dirname + '/../tls/producer-private-key.key'),
      cert: fs.readFileSync(
        __dirname + '/../../shared/tls/producer-certificate.cert'
      ),
    },
  });
  server.get('/recipes/:id', async (req: any, res) => {
    console.log(`worker request pid=${process.pid}`);
    const id = Number(req.params.id);
    if (id !== 42) {
      res.statusCode = 404;
      return { error: 'not_found' };
    }
    return {
      producer_pid: process.pid,
      recipe: {
        id,
        name: 'Chicken Tikka Masala',
        steps: 'Into the JSON over HTTP pot...',
        ingredients: [
          {
            id: 1,
            name: 'Chicken',
            quantity: '1 lb',
          },
          {
            id: 2,
            name: 'Sauce',
            quantity: '2 cups',
          },
        ],
      },
    };
  });

  server.listen(PORT, HOST, () => {
    console.log(`Producer recipe-API running at https://${HOST}:${PORT}`);
  });

  // node cluster
  // TYPE ERROR (is primary not defined)
  // const numCore = cpus().length;

  // if (cluster.default.isPrimary) {
  //   for (let i = 0; i < numCore; i++) {
  //     cluster.default.fork();
  //   }
  // } else {
  //   server.listen(PORT, HOST, () => {
  //     console.log(
  //       `Producer recipe-API ${process.pid} running at https://${HOST}:${PORT}`
  //     );
  //   });
  // }
}

// GraphQL
{
  //const server = fastify();
  // const graphql = fastifyGQL;
  // const schema = fs
  //   .readFileSync(__dirname + '/../../shared/src/graphql-schema.gql')
  //   .toString();
  // const resolvers = {
  //   Query: {
  //     pid: () => process.pid,
  //     recipe: async (_obj, { id }) => {
  //       if (id != 42) throw new Error(`recipe ${id} not found`);
  //       return {
  //         id,
  //         name: 'Chicken Tikka Masala',
  //         steps: 'Into the graphQL pot...',
  //       };
  //     },
  //   },
  //   Recipe: {
  //     ingredients: async (obj) => {
  //       return obj.id != 42
  //         ? []
  //         : [
  //             { id: 1, name: 'Chicken', quantity: '1 lb' },
  //             { id: 2, name: 'Sauce', quantity: '2 cups' },
  //           ];
  //     },
  //   },
  // };
  // server
  //   .register(graphql, { schema, resolvers, graphiql: true })
  //   .listen(PORT, HOST, () => {
  //     console.log(
  //       `Producer recipe-graphQL-API running at http://${HOST}:${PORT}/graphql`
  //     );
  //   });
}

// gRPC
{
  // const pkg_def = loader.loadSync(__dirname + '/../../shared/src/gRPC.proto');
  // const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
  // const server = new grpc.Server();
  // // @ts-ignore
  // server.addService(recipe.RecipeService.service, {
  //   getMetaData: (_req, res) => {
  //     res(null, {
  //       pid: process.pid,
  //     });
  //   },
  //   getRecipe: (req, res) => {
  //     if (req.request.id !== 42) {
  //       return res(new Error(`Unknown recipe ${req.request.id}`));
  //     }
  //     res(null, {
  //       id: 42,
  //       name: 'Chicke Tikka Masala',
  //       steps: 'Into the gRPC pot...',
  //       ingredients: [
  //         { id: 1, name: 'Chicken', quantity: '1 lb' },
  //         { id: 2, name: 'Sauce', quantity: '2 cups' },
  //       ],
  //     });
  //   },
  // });
  // server.bindAsync(
  //   `${HOST}:${PORT}`,
  //   grpc.ServerCredentials.createInsecure(),
  //   (err, port) => {
  //     if (err) throw err;
  //     server.start();
  //     console.log(
  //       `Producer recipe-gRPC-API running at http://${HOST}:${port}/`
  //     );
  //   }
  // );
}
