import { gql } from "@apollo/client";

export const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($secondMember: ID!) {
    roomCreate(input: { secondMember: $secondMember }) {
      room {
        title
      }
      errors
    }
  }
`;