import React, { useState, useEffect, useRef } from "react";
import { Send } from "react-feather";
import { backendUrl } from "../config/variables";
import Dock from "../components/Dock";
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MSG_FOR_ROOM } from "../callbacks/queries/getMessagesForRoom.query";
import { CREATE_MSG_MUTATION } from "../callbacks/mutations/createMessage.mutation";
import { SUBSCRIPTION_ADD_MESSAGE_TO_ROOM } from "../callbacks/subscriptions/addMessageToRoom.watch";
import { GET_USER_QUERY } from "../callbacks/queries/GetUser.query";

export const MessagesRoomPage = () => {
  const { id } = useParams();
  const roomId = parseInt(id);

  const messagesEndRef = useRef(null);

  const { loading: userLoading, data: userData } = useQuery(GET_USER_QUERY);
  const { loading, error, data, subscribeToMore } = useQuery(GET_MSG_FOR_ROOM, {
    variables: { roomId }
  });

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [createMessage] = useMutation(CREATE_MSG_MUTATION);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (data?.messagesForRoom) {
      setMessages(data.messagesForRoom);
      scrollToBottom();
    }
  }, [data]);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIPTION_ADD_MESSAGE_TO_ROOM,
      variables: { roomId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageAddedToRoom;
        return {
          messagesForRoom: [...prev.messagesForRoom, newMessage]
        };
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore, roomId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      await createMessage({
        variables: { roomId, body: messageInput }
      });
      setMessageInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !userData?.currentUser) {
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <span>{error?.message || "Ошибка загрузки чата"}</span>
      </div>
    );
  }

  const currentUserId = userData.currentUser.id;

  return (
    <div className="flex flex-col h-screen bg-base-100 relative">
      {/* Хедер */}
      <div className="navbar bg-base-200 shadow-md z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 px-4">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src="https://placehold.jp/a51d2d/ffffff/100x100.png?text=J" alt="Собеседник" />
              </div>
            </div>
            <h1 className="font-semibold text-lg">John Doe</h1>
          </div>
        </div>
      </div>

      {/* Сообщения — с отступом снизу под фиксированный инпут + Dock */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-4">
        {messages.map((message) => {
          const isMine = message.user.id === currentUserId;
          const avatarUrl = message.user.avatarUrl
            ? `${backendUrl}/${message.user.avatarUrl}`
            : "https://placehold.jp/a9b6a9/ffffff/100x100.png?text=B";

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
            >
              <div className="avatar flex-shrink-0">
                <div className="w-9 rounded-full">
                  <img src={avatarUrl} alt="Аватар" />
                </div>
              </div>

              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-primary text-base-content"
                    : "bg-base-300 text-base-content"
                }`}
              >
                <p className="break-words">{message.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Фиксированный блок ввода — над Dock */}
      <div className="fixed bottom-16 left-0 right-0 bg-base-200 border-t border-base-300 p-4 z-20">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            className="input input-bordered flex-1"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="btn btn-primary btn-circle text-base-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <Dock />
    </div>
  );
};