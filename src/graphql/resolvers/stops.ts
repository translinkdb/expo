import { StopsService } from "../../services/db/StopsService";
import { StopsFilters } from "../../structures/graphql/filters";

export async function stopsResolver(
  _parent: any,
  { filters }: { filters?: StopsFilters }
) {
  const stopsService = new StopsService();

  return await stopsService.list(filters);
}
