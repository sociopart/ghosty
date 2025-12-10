import { gql } from "@apollo/client";

export const GET_ROOMS_QUERY = gql`
  query chatRooms {
    chatRooms {
      id
      title
    }
  }
`;