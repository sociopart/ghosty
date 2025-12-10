import { gql } from "@apollo/client";

export const GET_USER_QUERY = gql`
  query {
    currentUser {
      id
      email
      avatarUrl
      profileHeaderUrl
    }
  }
  `;