import { Route } from "../../db/entities/Route";
import { PatternsService } from "../../services/db/PatternsService";
import { RoutesService } from "../../services/db/RoutesService";
import { RoutesFilters } from "../../structures/graphql/filters";

const patternsService = new PatternsService();
const routesService = new RoutesService();

export const routesResolver = async (
  _parent: any,
  { filters }: { filters?: RoutesFilters }
) => {
  return await routesService.list(filters);
};

export const routePatternsResolver = async (parent: Route) => {
  const patterns = await patternsService.fetchPatterns(parent.id);

  return patterns;
};
