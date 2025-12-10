import { gql } from '@apollo/client';

export const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      # define any payload fields here, such as a JWT token or user object
      accessToken
      errors
      user {
        email
      }
    }
  }
`;

