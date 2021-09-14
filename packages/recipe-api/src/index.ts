import fastify from 'fastify';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

const server = fastify();

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
      steps: 'Into the pot...',
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
  console.log(`Producer recipe-API running at http://${HOST}:${PORT}`);
});
