import { gql } from "@apollo/client";

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($body: String!, $files: [Upload!]) {
    postCreate(input: { body: $body, files: $files }) {
      post {
        id
        body
        createdAt
        updatedAt
        userId
      }
      errors
    }
  }
`;
