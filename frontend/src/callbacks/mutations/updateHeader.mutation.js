import { gql } from "@apollo/client";

export const UPD_HEADER_MUTATION = gql`
  mutation updateProfileHeader($profile_header: Upload!) {
    updateProfileHeader(input: { profileHeader: $profile_header }) {
      success
      errors
      user {
        id
        name
        email
        profileHeaderUrl
      }
    }
  }
`;