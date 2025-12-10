import { gql } from "@apollo/client";

export const GET_MSG_FOR_ROOM = gql`
query MessagesForRoom($roomId: ID!) {
  messagesForRoom(roomId: $roomId) {
    body
    user {
      id
      avatarUrl
    }
  }
}
`;
