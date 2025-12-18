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

const QUEUE_KEY_PREFIX = 'pendingMessages_';

export const MessagesRoomPage = () => {
  const { id } = useParams();
  const roomId = parseInt(id);
  const queueKey = QUEUE_KEY_PREFIX + roomId;

  const messagesEndRef = useRef(null);

  const { loading: userLoading, data: userData } = useQuery(GET_USER_QUERY);
  const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_MSG_FOR_ROOM, {
    variables: { roomId },
    fetchPolicy: "cache-and-network" // всегда проверяем сервер
  });

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const [createMessage, { loading: sending }] = useMutation(CREATE_MSG_MUTATION, {
    onCompleted: () => {
      refetch();
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Сеть
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Реальные сообщения из GraphQL
  useEffect(() => {
    if (data?.messagesForRoom) {
      setMessages(data.messagesForRoom);
    }
  }, [data]);

  // Загрузка pending из localStorage (оффлайн)
  useEffect(() => {
    if (!userData?.currentUser) return;
    const stored = JSON.parse(localStorage.getItem(queueKey) || '[]');
    setPendingMessages(stored.map(entry => ({
      tempId: entry.tempId,
      id: entry.tempId,
      body: entry.body,
      user: userData.currentUser
    })));
  }, [userData, queueKey]);

  useEffect(() => scrollToBottom(), [messages, pendingMessages]);

  // Подписка на новые сообщения
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

  // Синхронизация оффлайн-очереди
  useEffect(() => {
    if (!isOnline) return;

    const syncQueue = async () => {
      const pending = JSON.parse(localStorage.getItem(queueKey) || '[]');
      if (pending.length === 0) return;

      for (const entry of pending) {
        try {
          await createMessage({
            variables: { roomId, body: entry.body }
          });
          const newPending = pending.filter(p => p.tempId !== entry.tempId);
          localStorage.setItem(queueKey, JSON.stringify(newPending));
          setPendingMessages(prev => prev.filter(m => m.tempId !== entry.tempId));
        } catch (err) {
          console.error('Sync failed:', err);
          break;
        }
      }
      refetch();
    };

    syncQueue();
  }, [isOnline, createMessage, roomId, queueKey, refetch]);

  // Оптимистическое добавление только для оффлайн
  const addOptimisticMessage = (body) => {
    const tempId = 'temp-' + Date.now();
    setPendingMessages(prev => [...prev, {
      tempId,
      id: tempId,
      body,
      user: userData.currentUser
    }]);
    return tempId;
  };

  const enqueueMessage = (body, tempId) => {
    const pending = JSON.parse(localStorage.getItem(queueKey) || '[]');
    pending.push({ tempId, body });
    localStorage.setItem(queueKey, JSON.stringify(pending));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const body = messageInput.trim();
    setMessageInput("");

    if (isOnline) {
      try {
        await createMessage({
          variables: { roomId, body }
        });
        // Сразу обновляем список сообщений с сервера
        refetch();
      } catch (err) {
        console.error('Send failed:', err);
        const tempId = addOptimisticMessage(body);
        enqueueMessage(body, tempId);
      }
    } else {
      const tempId = addOptimisticMessage(body);
      enqueueMessage(body, tempId);
      setShowOfflineModal(true);
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
  const allMessages = [...messages, ...pendingMessages];

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

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-4">
        {allMessages.map((message) => {
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
                  isMine ? "bg-primary text-base-content" : "bg-base-300 text-base-content"
                }`}
              >
                <p className="break-words">{message.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Инпут */}
      <div className="fixed bottom-16 left-0 right-0 bg-base-200 border-t border-base-300 p-4 z-20">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            className="input input-bordered flex-1"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="btn btn-primary btn-circle text-base-100"
          >
            {sending ? <span className="loading loading-spinner loading-xs"></span> : <Send size={20} />}
          </button>
        </div>
      </div>

      <Dock />

      {/* Оффлайн модалка */}
      <dialog className="modal" open={showOfflineModal}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Сообщение сохранено</h3>
          <p className="py-4">
            Нет интернета. Сообщение будет отправлено автоматически при восстановлении связи.
          </p>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={() => setShowOfflineModal(false)}>
              OK
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowOfflineModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};