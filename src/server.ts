import { ApolloServer } from "apollo-server";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  csrfPrevention: true,
});

server.listen().then(({ url }) => console.log(`Server is ready at ${url}`));
