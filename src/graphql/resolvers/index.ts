import { ingestGTFSStaticDataResolver } from "./misc";
import {
  patternHeadsignResolver,
  patternShapeResolver,
  patternTripCountResolver,
} from "./patterns";
import { routePatternsResolver, routesResolver } from "./routes";
import { shapePointsResolver } from "./shapes";
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
  Pattern: {
    headsign: patternHeadsignResolver,
    tripCount: patternTripCountResolver,
    shape: patternShapeResolver,
  },
  Shape: {
    points: shapePointsResolver,
  },
};
