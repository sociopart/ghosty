import { gql } from "@apollo/client";

export const GET_POSTS_QUERY = gql`
  query allPosts {
    allPosts {
      id
      body
      createdAt
      updatedAt
      userId
      imageUrls {
        id
        url
      }
      comments{
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