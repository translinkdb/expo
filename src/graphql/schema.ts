import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type Query {
    # Static
    routes(filters: RouteFilters): [Route!]!
    stops(filters: StopFilters): [Stop!]!
    patterns(filters: PatternFilters): [Pattern!]!

    # GTFS Realtime
    vehiclePositions(forceRefetch: Boolean): [VehiclePosition!]!
  }

  type Mutation {
    ingestGTFSStaticData: String
  }

  # Return types

  type Route {
    id: ID!
    number: String!
    name: String!
    patterns: [Pattern!]!
  }

  type Stop {
    id: ID!
    code: String!
    name: String!
    coordinates: Coordinates!
    zone: String!
  }

  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  type Pattern {
    id: ID!
    name: String!
    headsign: String!
    tripCount: Int!
    shape: Shape!
  }

  type Shape {
    id: ID!
    points: [ShapePoint!]!
  }

  type ShapePoint {
    coordinates: Coordinates!
    order: Int!
    cumulativeDistance: Float!
  }

  type Trip {
    id: Int!
    headsign: String!
    routePattern: RoutePattern!
  }

  type RoutePattern {
    routeID: Int!
    route: Route!

    patternID: Int!
    pattern: Pattern!
  }

  type VehiclePosition {
    timestamp: Date!
    position: Coordinates!
    trip: Trip!
    vehicleID: Int
  }

  # Input types
  input RouteFilters {
    number: StringFilter
    name: StringFilter
  }

  input StopFilters {
    code: StringFilter
    name: StringFilter
    coordinates: CoordinatesFilter
  }

  input PatternFilters {
    id: ID
    routeID: ID
  }

  input StringFilter {
    contains: String
    exact: String
  }

  input CoordinatesInput {
    latitude: Float!
    longitude: Float!
  }

  input CoordinatesFilter {
    exact: CoordinatesInput
    near: CoordinatesInput
    radius: Float
  }
`;
