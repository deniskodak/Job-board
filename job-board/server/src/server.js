import cors from 'cors';
import express from 'express';

import { authMiddleware, handleLogin } from './auth.js';

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { readFile } from 'node:fs/promises'

import { resolvers } from './resolvers.js'
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js'

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./src/schema.graphql', 'utf8');

const server = new ApolloServer({ typeDefs, resolvers})
await server.start()

const getContext = async ({ req }) => {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };

  if(req.auth) {
    context.user = await getUser(req.auth.sub);
  };

  return context;
}

app.use('/graphql', expressMiddleware(server, { context: getContext }))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql running on http://localhost:${PORT}/graphql`)
});