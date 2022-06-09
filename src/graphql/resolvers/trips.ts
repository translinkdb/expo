import { RoutePattern } from "../../db/entities/Pattern";
import { Trip } from "../../db/entities/Trip";
import { PatternsService } from "../../services/db/PatternsService";
import { RoutesService } from "../../services/db/RoutesService";
import { TripsService } from "../../services/db/TripsService";

const tripsService = new TripsService();
const routesService = new RoutesService();
const patternsService = new PatternsService();

export async function routePatternResolver(trip: Trip) {
  return await tripsService.fetchRoutePattern(trip);
}

export async function tripRouteResolver(routePattern: RoutePattern) {
  return routesService.get(routePattern.routeID);
}

export async function tripPatternResolver(routePattern: RoutePattern) {
  return patternsService.get(routePattern.patternID);
}
