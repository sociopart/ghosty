import React, { useState, useEffect } from "react";
import { Send, MessageCircle } from "react-feather";
import { backendUrl } from "../config/variables";
import Dock from "../components/Dock";
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MSG_FOR_ROOM } from "../callbacks/queries/getMessagesForRoom.query";
import { CREATE_MSG_MUTATION } from "../callbacks/mutations/createMessage.mutation";
import { SUBSCRIPTION_ADD_MESSAGE_TO_ROOM } from "../callbacks/subscriptions/addMessageToRoom.watch"; // Import the SUBSCRIPTION_ADD_MESSAGE_TO_ROOM subscription
import { GET_USER_QUERY } from "../callbacks/queries/GetUser.query";

export const MessagesRoomPage = () => {
  const { id } = useParams();

  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER_QUERY);
  const { loading, error, data, subscribeToMore } = useQuery(GET_MSG_FOR_ROOM, {
    variables: { roomId: parseInt(id) }
  });

  const [messageInput, setMessageInput] = useState(""); // State for message input value
  const [messages, setMessages] = useState([]); // State for messages

  const [createMessage] = useMutation(CREATE_MSG_MUTATION); // Mutation hook

  const handleSendMessage = () => {
    createMessage({
      variables: { roomId: parseInt(id), body: messageInput }
    }).then(() => {
      // Reset message input after successful mutation
      setMessageInput("");
    });
  };

  useEffect(() => {
    if (data) {
      // Set initial messages data
      setMessages(data.messagesForRoom);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIPTION_ADD_MESSAGE_TO_ROOM,
      variables: { roomId: parseInt(id) },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageAddedToRoom;
        if (prev.messagesForRoom) {
          return {
            messagesForRoom: [...prev.messagesForRoom, newMessage]
          };
        }
        return {
          messagesForRoom: []
        };
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  if (error || userError) {
    return <div>Error: {error ? error.message : userError.message}</div>;
  }

  const currentUser = userData.currentUser; // Получаем объект текущего пользователя из данных запроса

  return (
    <div className="messages-page">
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-mainPurple shadow-md">
          <div className="flex items-center space-x-2">
            <img
              src="https://placehold.jp/a51d2d/ffffff/100x100.png?text=J"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-lg font-semibold text-usualWhite">John Doe</h1>
          </div>
          <button className="p-2 text-usualWhite">
            <MessageCircle size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow px-4 py-2 overflow-y-auto">
          {/* Message List */}
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = currentUser && message.user.id === currentUser.id; // Проверяем, является ли текущий пользователь

              return (
                <div
                  key={index}
                  className={`flex ${
                    isCurrentUser ? "items-end justify-end" : "items-start"
                  } space-x-2`}
                >
                  {message?.user && message?.user?.avatarUrl? (
                    <img
                      src={backendUrl + "/" + message.user.avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <img
                      src="https://placehold.jp/a9b6a9/ffffff/100x100.png?text=B"
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`bg-white rounded-lg p-2 ${
                      isCurrentUser ? "" : "bg-blue-500"
                    }`}
                  >
                    <p>{message.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center px-4 py-2 bg-white mb-16">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)} // Update message input value
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          />
          <button
            className="p-2 ml-2 bg-blue-500 rounded-full"
            onClick={handleSendMessage} // Call the handleSendMessage function on button click
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
        <Dock/>
      </div>
    </div>
  );
};
