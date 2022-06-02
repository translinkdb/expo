// The transformer keys should correspond with the database columns (where they exist)

const sharedTransformers = {};

export const routeKeyTransformers = {
  ...sharedTransformers,

  route_id: "id",
  agency_id: "agency",
  route_short_name: "number",
  route_long_name: "name",
  route_desc: "description",
  route_type: "type",
  route_url: "url",
  route_color: "color",
  route_text_color: "text_color",
};

export const stopKeyTransformers = {
  stop_id: "id",
  stop_code: "code",
  stop_name: "name",
  stop_desc: "description",
  stop_lat: "latitude",
  stop_lon: "longitude",
  zone_id: "zone",
  stop_url: "url",
  location_type: "location_type",
  parent_station: "parent_stop_id",
};

export const tripKeyTransformers = {
  trip_id: "id",
  trip_headsign: "headsign",
  trip_short_name: "short_name",
};

export const directionKeyTransformers = {
  direction: "cardinal_direction",
};

export const directionExceptionKeyTransformers = {
  direction_name: "name",
};

export const shapeKeyTransformers = {
  shape_pt_lat: "latitude",
  shape_pt_long: "longitude",
  shape_pt_sequence: "order",
  shape_dist_traveled: "cumulative_distance",
};

export const serviceKeyTransformers = {
  service_id: "id",
};

export const serviceExceptionKeyTransformers = {
  exception_type: "type",
};

export const stopTimeKeyTransformers = {
  arrival_time: "arrival",
  departure: "departure",
  stop_sequence: "order",
  shape_dist_traveled: "cumulative_distance",
  pickup_type: "is_pickup_restricted",
  drop_off_type: "is_dropoff_restricted",
};

export const patternKeyTransformers = {
  pattern_id: "id",
  pattern_name: "name",
};
