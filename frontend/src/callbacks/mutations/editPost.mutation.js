import { gql } from "@apollo/client";

export const EDIT_POST_MUTATION = gql`
  mutation EditPost($postId: ID!, $newBody: String!, $files: [Upload!], $deletedImagesIds: [ID!]) {
    postEdit(input: {postId: $postId, newBody: $newBody, files: $files, deletedImagesIds: $deletedImagesIds}) {
      post {
        id
        # Include other fields you want to retrieve
      }
      errors
    }
  }
`;