import { RoutesService } from "../../services/db/RoutesService";
import { RoutesFilters } from "../../structures/graphql/filters";

export const routesResolver = async (
  _parent: any,
  { filters }: { filters?: RoutesFilters }
) => {
  const routesService = new RoutesService();

  return await routesService.list(filters);
};
