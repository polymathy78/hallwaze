/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEntry = /* GraphQL */ `
  query GetEntry($id: ID!) {
    getEntry(id: $id) {
      id
      studentName
      studentId
      destination
      teacher
      teacherId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEntries = /* GraphQL */ `
  query ListEntries(
    $filter: ModelEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        studentName
        studentId
        destination
        teacher
        teacherId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
