// TLS CERT password - 1234
import fastify from 'fastify';
// const fastify = require("fastify")
import fetch from 'node-fetch';

import https = require('https');
import fs = require('fs');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

// GraphQL request
const complex_query = `
query kitchenSink($id:ID) {
  recipe(id: $id) {
    id 
    name
    ingredients {
      name
      quantity
    }
  }
  pid
}
`;

const server = fastify();
const options = {
  agent: new https.Agent({
    ca: fs.readFileSync(__dirname + '/../../shared/tls/ca-certificate.cert'),
  }),
};

// JSON over HTTP
// server.get('/', async () => {
//   const req = await fetch(`https://${TARGET}/recipes/42`, options);
//   const payload = await req.json();

//   return {
//     consumer_pid: process.pid,   
//     producer_data: payload,
//   };
// });

// GraphQL

server.get('/', async () => {
  const req = await fetch(`http://${TARGET}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: complex_query,
      variables: { id: '42' },
    }),
  });
  return {
    consumer_pid: process.pid,
    producer_data: await req.json(),
  };
});

server.listen(PORT, HOST, () => {
  console.log(`Consumer web-API  is running at http://${HOST}:${PORT}/`);
});
