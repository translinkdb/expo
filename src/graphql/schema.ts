import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    routes(filters: RouteFilters): [Route!]!
    stops(filters: StopFilters): [Stop!]!
  }

  # Return types

  type Route {
    id: ID!
    number: String!
    name: String!
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
