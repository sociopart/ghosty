import { gql } from "@apollo/client";

export const UPD_AVATAR_MUTATION = gql`
  mutation updateAvatar($avatar: Upload!) {
    updateAvatar(input: { avatar: $avatar }) {
      success
      errors
      user {
        id
        name
        email
        avatarUrl
      }
    }
  }
`;