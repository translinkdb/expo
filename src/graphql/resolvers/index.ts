import { ingestGTFSStaticDataResolver } from "./misc";
import { routePatternsResolver, routesResolver } from "./routes";
import { stopsResolver } from "./stops";

export const resolvers = {
  Query: {
    routes: routesResolver,
    stops: stopsResolver,
  },
  Mutation: {
    ingestGTFSStaticData: ingestGTFSStaticDataResolver,
  },
  Route: {
    patterns: routePatternsResolver,
  },
};
