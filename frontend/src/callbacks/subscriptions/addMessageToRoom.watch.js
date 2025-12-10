import { gql } from "@apollo/client";

export const SUBSCRIPTION_ADD_MESSAGE_TO_ROOM = gql`
  subscription ($roomId:ID!) {
    messageAddedToRoom(roomId:$roomId) {
      user {
        id
        avatarUrl
      }
      body
    }
  }
`;