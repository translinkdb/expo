import { ingestGTFSStaticDataResolver } from "./misc";
import {
  patternHeadsignResolver,
  patternShapeResolver,
  patternsResolver,
  patternTripCountResolver,
} from "./patterns";
import { vehiclePositionsResolver } from "./realtime";
import { routePatternsResolver, routesResolver } from "./routes";
import { shapePointsResolver } from "./shapes";
import { stopsResolver } from "./stops";
import {
  routePatternResolver,
  tripPatternResolver,
  tripRouteResolver,
} from "./trips";

export const resolvers = {
  Query: {
    routes: routesResolver,
    stops: stopsResolver,
    patterns: patternsResolver,
    vehiclePositions: vehiclePositionsResolver,
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
  Trip: {
    routePattern: routePatternResolver,
  },
  RoutePattern: {
    route: tripRouteResolver,
    pattern: tripPatternResolver,
  },
};
