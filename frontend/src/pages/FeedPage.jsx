import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Post from "../components/Post";
import Dock from "../components/Dock";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_POSTS_QUERY } from "../callbacks/queries/getPosts.query";
import { POST_CREATED_SUBSCRIPTION } from "../callbacks/subscriptions/postCreated.watch";
import { client, accessToken } from "../config/variables";
import { useNavigate } from "react-router-dom";



const PostsList = ({ posts }) => {
  const navigate = useNavigate();
  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };
  return posts.map((post) => (
    <div className="mt-8 md:mt-10 lg:mt-12 xl:mt-16" key={post.id}>
      {post != null && (
        <Post
          userProfile=""
          postContent={post.body}
          postTime={post.createdAt}
          postEmbedded={post.imageUrls.map((image) => image.url)}
          onEditPost={() => handleEditPost(post.id)}
        />
      )}
    </div>
  ));
};

export const FeedPageComponent = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_POSTS_QUERY, {
    variables: { accessToken },
  });

  const [posts, setPosts] = useState([]);
  

  useEffect(() => {
    if (data && data.allPosts) {
      setPosts(data.allPosts);
    }
  }, [data]);

  // Should be fixed to null = false (in backend). But works
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: POST_CREATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (subscriptionData.data.postCreated == null) return prev;

        return {
          allPosts: [subscriptionData.data.postCreated].concat([prev]),
        };
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="h-screen bg-usualWhite">
      <Header title="Новости" />
      <div className="flex flex-col h-screen">
        <div className="flex-none"></div>
        <div className="flex-1 py-2 sm:py-8 md:py-6 lg:py-8 xl:py-12 bg-usualWhite mt-8">
          {posts != null && (
            <PostsList posts={posts} />
          )}
        </div>
      </div>
      <Dock />
    </div>
  );
};
