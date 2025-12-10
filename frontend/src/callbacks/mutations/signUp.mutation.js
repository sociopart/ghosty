import { gql } from "@apollo/client";

export const SIGN_UP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      # define any payload fields here, such as a JWT token or user object
      accessToken
      errors
      user{
        id
        email
        name
      }
    }
  }
`;