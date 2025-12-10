import { gql } from "@apollo/client";

export const GET_POST_BY_ID_QUERY = gql`
  query getPostById($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      updatedAt
      userId
      imageUrls {
        id
        url
      }
      comments {
        body
        createdAt
        id
        parentId
        postId
        relationTo
        updatedAt
        userId
        comments {
          body
          createdAt
          id
          parentId
          postId
          relationTo
          updatedAt
          userId
        }
      }
    }
  }
`;
