import React from "react";
import { ChevronDown, MessageCircle } from "react-feather";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_ROOMS_QUERY } from "../callbacks/queries/getChatRooms.query";
import Header from '../components/Header';
import Dock from '../components/Dock';

export const MessagesPage = () => {
  const { loading, error, data } = useQuery(GET_ROOMS_QUERY);

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
        <span>Ошибка: {error.message}</span>
      </div>
    );
  }

  const chatList = data?.chatRooms || [];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header title="Сообщения" />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Поиск */}
          {/* <div className="form-control mb-6">
            <div className="input-group">
              <input
                type="text"
                placeholder="Поиск чатов..."
                className="input input-bordered w-full"
              />
              <button className="btn btn-square btn-primary">
                <Search size={20} />
              </button>
            </div>
          </div> */}

          <div className="space-y-4 mt-10">
            {chatList.length === 0 ? (
              <div className="text-center py-20 text-base-content/60">
                <MessageCircle size={80} className="mx-auto mb-6 opacity-40" />
                <p className="text-2xl font-medium">Нет активных чатов</p>
                <p className="text-lg mt-2">Начните общение с друзьями!</p>
              </div>
            ) : (
              chatList.map((chat) => (
                <Link key={chat.id} to={`/im/${chat.id}`}>
                  <div className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="card-body py-4 px-6 flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-14 h-14 rounded-full">
                          <img
                            src={`https://i.pravatar.cc/150?img=${chat.id}`}
                            alt="Avatar"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{chat.title}</h3>
                      </div>
                      <ChevronDown size={20} className="text-base-content/40 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <Dock />
    </div>
  );
};