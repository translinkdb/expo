import { routesResolver } from "./routes";
import { stopsResolver } from "./stops";

export const resolvers = {
  Query: {
    routes: routesResolver,
    stops: stopsResolver,
  },
};