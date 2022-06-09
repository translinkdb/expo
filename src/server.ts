import { ApolloServer } from "apollo-server";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import { redisClient } from "./redis/client";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  csrfPrevention: true,
});

Promise.all([
  redisClient.connect().then(() => console.log("Connected to Redis!")),
  server.listen().then(({ url }) => console.log(`Server is ready at ${url}!`)),
]);
