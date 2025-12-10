import { gql } from '@apollo/client';

export const SIGN_OUT_MUTATION = gql`
  mutation {
    signOut(input: {}) {
      # define any payload fields here, such as a JWT token or user object
      success
    }
  }
`;