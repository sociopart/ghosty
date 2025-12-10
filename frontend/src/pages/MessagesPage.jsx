import React from "react";
import { Users, ChevronDown, Search } from "react-feather";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom"; // Import Link component
import { GET_ROOMS_QUERY } from "../callbacks/queries/getChatRooms.query";
import Header from '../components/Header';
import Dock from '../components/Dock';

export const MessagesPage = () => {
  const { loading, error, data } = useQuery(GET_ROOMS_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const chatList = data.chatRooms;

  return (
    <div className="bg-white h-screen w-screen p-4 sm:p-8">
      <Header title="Сообщения"/>
      <div className="messages-page mt-20">
        <div className="flex flex-col space-y-4">
          {chatList.map((chat) => (
            <Link key={chat.id} to={`/im/${chat.id}`}> {/* Wrap with Link component and set the "to" attribute */}
              <div className="flex items-center space-x-4 p-4 bg-lightGrey rounded-lg">
                <img
                  src={`https://i.pravatar.cc/50?img=${chat.id}`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{chat.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between p-4 shadow-t sm:shadow-none">
          <button className="flex items-center space-x-2">
            <Users size={20} className="text-gray-500" />
            <span className="text-gray-500">Contacts</span>
          </button>
          <button className="flex items-center space-x-2">
            <ChevronDown size={20} className="text-gray-500" />
            <span className="text-gray-500">More</span>
          </button>
        </div>
      </div>
      <Dock/>
    </div>
  );
};
