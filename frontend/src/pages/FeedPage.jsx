import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Post from "../components/Post";
import Dock from "../components/Dock";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_POSTS_QUERY } from "../callbacks/queries/getPosts.query";
import { POST_CREATED_SUBSCRIPTION } from "../callbacks/subscriptions/postCreated.watch";
import { accessToken } from "../config/variables";
import { useNavigate } from "react-router-dom";

const PostsList = ({ posts }) => {
  const navigate = useNavigate();

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return posts.map((post, index) => (
    <div
      key={post.id}
      className="mt-8 md:mt-10 lg:mt-12 xl:mt-16 opacity-0 animate-fade-slide"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {post && (
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
    if (data?.allPosts) {
      setPosts(data.allPosts);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: POST_CREATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data?.postCreated) return prev;
        const newPost = subscriptionData.data.postCreated;
        return {
          allPosts: [newPost, ...prev.allPosts],
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Header title="Новости" />
      <div className="pb-20 md:pb-0"> {/* отступ под Dock на мобильных */}
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {posts.length > 0 ? (
            <PostsList posts={posts} />
          ) : (
            <div className="text-center py-20 text-base-content/60">
              <p className="text-2xl">Пока нет записей</p>
              <p>Будьте первым!</p>
            </div>
          )}
        </div>
      </div>
      <Dock />
    </div>
  );
};