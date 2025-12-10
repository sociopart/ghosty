import { useState } from "react";
import { Heart, MessageCircle, Share2, Edit2 } from "react-feather";
import { backendHostName, backendUrl } from "../config/variables";
import Comments from "./Comments";

const Post = ({ userProfile, postContent, postTime, postEmbedded, onEditPost }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const handleEditPost = () => {
    onEditPost(); // Trigger the callback function to handle edit post
  };

  return (
    <div className="mx-auto w-7/8 bg-white p-4 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-5 md:mr-5"
            src={userProfile}
            alt="User profile"
          />
          <div className="md:mr-5">
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-sm text-gray-500">{postTime}</div>
          </div>
        </div>
        <div>
          <button onClick={handleEditPost} className="mx-2 flex">
            <Edit2 size={18} className="" /> {/* Change to Edit2 icon */}
          </button>
        </div>
      </div>
      <div className="mr-4 text-base ml-5">{postContent}</div>
      <div className="mr-4 text-base ml-5">
        {postEmbedded && (
          <div className="flex flex-wrap">
            {Array.from(
              { length: Math.min(10, postEmbedded.length) },
              (_, index) => (
                <img
                  key={index}
                  src={backendUrl + postEmbedded[index]}
                  alt="Embedded Image"
                  className="sm:max-w-1/4 sm:max-h-1/4 md:max-w-1/4 md:max-h-1/4 lg:max-w-1/4 lg:max-h-1/4 xl:max-w-1/4 xl:max-h-1/4"
                  style={{ width: "100px", height: "100px" }}
                />
              )
            )}
          </div>
        )}
      </div>
      <div className="mt-4 ml-3 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleLike} className="mx-2 flex">
            <Heart size={24} className="" />
            <span className=" mx-2">{likes}</span>
          </button>
          <button className="mx-2">
            <MessageCircle size={24} className="text-usualWhite" />
          </button>
          <button className="mx-2">
            <Share2 size={24} className="text-usualWhite" />
          </button>
        </div>
        <div>{/*donate btn */}</div>
      </div>
      <div className="mt-4 ml-5">
        <form onSubmit={handleComment} className="flex items-center">
          <input
            type="text"
            className="w-2/3 border border-gray-400 rounded-full p-2 mr-2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="bg-transparent font-bold">
            Post
          </button>
        </form>
      </div>
      <Comments />
    </div>
  );
};

export default Post;
