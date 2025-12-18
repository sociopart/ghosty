import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Post from "../components/Post";
import Dock from "../components/Dock";
import { useQuery } from "@apollo/client";
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
      className="mt-8 md:mt-10 lg:mt-12 xl:mt-16 animate-fade-slide"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Post
        userProfile=""
        postContent={post.body}
        postTime={post.createdAt}
        postEmbedded={post.imageUrls.map((image) => image.url)}
        onEditPost={() => handleEditPost(post.id)}
      />
    </div>
  ));
};

export const FeedPageComponent = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_POSTS_QUERY, {
    variables: { accessToken },
  });

  const [visiblePosts, setVisiblePosts] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState([]); // новые, скрытые

  useEffect(() => {
    if (data?.allPosts) {
      setVisiblePosts(data.allPosts);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: POST_CREATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data?.postCreated) return prev;
        const newPost = subscriptionData.data.postCreated;

        setHiddenPosts((prev) => [newPost, ...prev]);

        return prev;
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  const showNewPosts = () => {
    if (hiddenPosts.length > 0) {
      setVisiblePosts((prev) => [...hiddenPosts.reverse(), ...prev]);
      setHiddenPosts([]);
    }
  };

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

  const hasNew = hiddenPosts.length > 0;

  return (
    <div className="min-h-screen bg-base-100 relative">
      <Header title="Новости" />

      {hasNew && (
        <div className="fixed top-16 left-0 right-0 z-40 px-4 pt-2">
          <button onClick={showNewPosts} className="btn btn-primary w-full shadow-lg">
            {hiddenPosts.length} {hiddenPosts.length === 1 ? 'новый пост' : 'новых постов'} — показать
          </button>
        </div>
      )}

      <div className={`pb-20 md:pb-0 ${hasNew ? "pt-20" : ""}`}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Скрытые новые посты */}
          <div className="h-0 overflow-hidden visibility-hidden">
            <PostsList posts={hiddenPosts} />
          </div>

          {/* Видимые посты */}
          {visiblePosts.length > 0 ? (
            <PostsList posts={visiblePosts} />
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