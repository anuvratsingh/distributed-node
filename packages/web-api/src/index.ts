// TLS CERT password - 1234
import fastify from 'fastify';
// const fastify = require("fastify")
import fetch from 'node-fetch';

import grpc = require('@grpc/grpc-js');
import loader = require('@grpc/proto-loader');

import https = require('https');
import fs = require('fs');
import util = require('util');
import path = require('path');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

const server = fastify();
const options = {
  agent: new https.Agent({
    ca: fs.readFileSync(__dirname + '/../../shared/tls/ca-certificate.cert'),
  }),
};

// JSON over HTTP
{
  // server.get('/', async () => {
  //   const req = await fetch(`https://${TARGET}/recipes/42`, options);
  //   const payload = await req.json();
  //   return {
  //     consumer_pid: process.pid,
  //     producer_data: payload,
  //   };
  // });
}

// GraphQL
{
  //   const complex_query = `
  // query kitchenSink($id:ID) {
  //   recipe(id: $id) {
  //     id
  //     name
  //     ingredients {
  //       name
  //       quantity
  //     }
  //   }
  //   pid
  // }
  // `;
  //   server.get('/', async () => {
  //   const req = await fetch(`http://${TARGET}/graphql`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       query: complex_query,
  //       variables: { id: '42' },
  //     }),
  //   });
  //   return {
  //     consumer_pid: process.pid,
  //     producer_data: await req.json(),
  //   };
  // });
  // server.listen(PORT, HOST, () => {
  //   console.log(`Consumer web-API  is running at http://${HOST}:${PORT}/`);
  // });
}

// gRPC

const pkg_def = loader.loadSync(
  path.join(__dirname, '/../../shared/src/gRPC.proto')
);

const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
// @ts-ignore
const client = new recipe.RecipeService(
  TARGET,
  grpc.credentials.createInsecure()
);
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

server.get('/', async () => {
  const [meta, recipe] = await Promise.all([
    getMetaData({}),
    // @ts-ignore
    getRecipe({ id: 42 }),
  ]);

  return {
    consumer_pid: process.pid,
    producer_data: meta,
    recipe,
  };
});

server.listen(PORT, HOST, () => {
  console.log(`Conusmer web-gRPC-API running at http://${HOST}:${PORT}/`);
});

path.join(__dirname, '/../../shared/src/gRPC.proto');
