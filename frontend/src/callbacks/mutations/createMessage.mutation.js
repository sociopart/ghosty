import { gql } from "@apollo/client";

export const CREATE_MSG_MUTATION = gql`
  mutation MessageCreate($roomId: ID!, $body: String!) {
    messageCreate(input: { roomId: $roomId, body: $body }) {
      message {
        user {
          id
        }
        body
      }
      errors
    }
  }
`;
