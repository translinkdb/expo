import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    routes(filters: RouteFilters): [Route!]!
    stops(filters: StopFilters): [Stop!]!
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
    name: String!
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
