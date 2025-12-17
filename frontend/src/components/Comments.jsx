import { useState } from 'react';
import { MessageCircle, Trash2, ChevronDown, ChevronUp } from 'react-feather';

const Comment = ({ name, avatar, text, time = "1 час назад", nestedComments = [], depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasNested = nestedComments.length > 0;

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className="avatar flex-shrink-0">
        <div className="w-10 h-10 rounded-full">
          <img src={avatar} alt={`${name}'s avatar`} />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{name}</span>
          <span className="text-xs text-base-content/60">{time}</span>
        </div>

        <p className="mt-1 text-base-content">{text}</p>

        <div className="flex items-center gap-4 mt-2">
          <button className="text-sm flex items-center gap-1 hover:text-primary transition">
            <MessageCircle size={16} />
            Ответить
          </button>
          <button className="text-sm flex items-center gap-1 hover:text-error transition">
            <Trash2 size={16} />
            Удалить
          </button>

          {hasNested && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-auto text-sm flex items-center gap-1 hover:text-primary transition"
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {nestedComments.length} {nestedComments.length === 1 ? 'ответ' : 'ответа'}
            </button>
          )}
        </div>

        {hasNested && isOpen && (
          <div className="mt-4">
            {nestedComments.map((nested) => (
              <Comment key={nested.id} {...nested} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments = () => {
  const [comments] = useState([
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
  ]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Комментарии ({comments.length})</h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-base-content/60 py-8">
          Пока нет комментариев. Будьте первым!
        </p>
      )}
    </div>
  );
};

export default Comments;