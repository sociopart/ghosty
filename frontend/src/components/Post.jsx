import { useState } from "react";
import { Heart, MessageCircle, Share2, Edit2 } from "react-feather";
import { backendUrl } from "../config/variables";
import Comments from "./Comments";

const Post = ({ userProfile, postContent, postTime, postEmbedded, onEditPost }) => {
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => setLikes(likes + 1);
  const handleEditPost = () => onEditPost?.();

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setNewComment("");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl my-6 max-w-2xl mx-auto">
      <div className="card-body p-4 md:p-6">
        {/* Header поста */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={userProfile} alt="avatar" />
              </div>
            </div>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-base-content/60">{postTime}</div>
            </div>
          </div>
          <button onClick={handleEditPost} className="btn btn-ghost btn-circle">
            <Edit2 size={20} />
          </button>
        </div>

        {/* Текст поста */}
        <div className="mt-4 text-base">{postContent}</div>

        {/* Изображения */}
        {postEmbedded && postEmbedded.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {postEmbedded.slice(0, 10).map((img, i) => (
              <img
                key={i}
                src={`${backendUrl}${img}`}
                alt="post media"
                className="rounded-lg object-cover w-full aspect-square"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-primary transition">
              <Heart size={24} className={likes > 0 ? "fill-primary text-primary" : ""} />
              <span>{likes}</span>
            </button>
            <button className="hover:text-primary transition">
              <MessageCircle size={24} />
            </button>
            <button className="hover:text-primary transition">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* Форма комментария */}
        <form onSubmit={handleComment} className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Напишите комментарий..."
            className="input input-bordered flex-1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="btn btn-primary text-base-100">
            Отправить
          </button>
        </form>

        {/* Комментарии */}
        <div className="mt-4">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default Post;