import { gql } from "@apollo/client";

export const GET_USER_BY_ID_QUERY = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      email
      avatarUrl
      profileHeaderUrl
    }
  }
`;