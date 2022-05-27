const sharedTransformers = {
  route_id: "routeID",
  stop_id: "stopID",
};

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
  route_text_color: "textColor",
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
  location_type: "locationType",
  parent_station: "parentStationID",
};
