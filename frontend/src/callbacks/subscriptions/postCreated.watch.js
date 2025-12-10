import { gql } from "@apollo/client";

export const POST_CREATED_SUBSCRIPTION = gql`
subscription {
  postCreated {
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
`