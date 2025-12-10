import React from "react";
import { useQuery } from "@apollo/client";
import Header from "../components/Header";
import Dock from "../components/Dock";
import EditPostForm from "../components/forms/EditPostForm";
import { GET_POST_BY_ID_QUERY } from "../callbacks/queries/getPostById.query.js";
import "./../../src/public/css/tailwind.css";
import { useParams } from "react-router-dom";
import { backendUrl } from "../config/variables.js";

export const EditPostPageComponent = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_POST_BY_ID_QUERY, {
    variables: { postId: parseInt(id) },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const post = data?.getPost;

  return (
    <div className="h-screen bg-usualWhite">
      <Header title="Редактировать запись" />
      <div className="flex-1 py-2 md:py-4 lg:py-8 xl:py-12 bg-usualWhite top-19 mt-10">
        <EditPostForm 
           postId          = {post.id}
           initialBody     = {post.body}
           initialImages   = {post.imageUrls.map((image) => backendUrl + image.url)}
           initialImageIds = {post.imageUrls.map((image) => image.id)}
        />
      </div>
      <Dock />
    </div>
  );
};
