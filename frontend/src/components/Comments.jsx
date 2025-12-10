import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Trash2 } from 'react-feather';

const Comment = ({ name, avatar, text, nestedComments }) => {
  return (
    <div className="flex mt-4">
      <img
        className="w-10 h-10 rounded-full mr-5"
        src={avatar}
        alt={`${name}'s profile picture`}
      />
      <div className="flex-1">
        <div className="flex items-center justify-start">
          <h3 className="text-sm font-medium">{name}</h3>
          <span className="ml-5 text-xs text-gray-500">1 hour ago</span>
        </div>
        <p className="text-base mt-1">{text}</p>
        {nestedComments &&
          nestedComments.map((comment) => (
            <div key={comment.id} className="pl-10">
              <Comment {...comment} />
            </div>
          ))}
      </div>
    </div>
  );
};

const Comments = () => {
  const comments = [
    {
      id: 1,
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam suscipit urna vitae quam euismod tincidunt. Proin sed suscipit justo, vel blandit nulla.",
      nestedComments: [
        {
          id: 2,
          name: "Bob Johnson",
          avatar: "https://i.pravatar.cc/150?img=2",
          text: "Fusce eget bibendum velit. Sed euismod lobortis turpis, eget tristique enim pharetra in.",
        },
        {
          id: 3,
          name: "Emma Davis",
          avatar: "https://i.pravatar.cc/150?img=3",
          text: "Vivamus sodales dictum augue, at finibus tellus consectetur id.",
        },
      ],
    },
    {
      id: 4,
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=4",
      text: "Suspendisse a dolor orci. Integer euismod sapien vel massa malesuada malesuada.",
    },
  ];

  return (
    <div className="text-white px-4 py-3 mt-4">
      <h2 className="text-lg font-bold mb-4 text-usualWhite">Комментарии</h2>
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export default Comments;