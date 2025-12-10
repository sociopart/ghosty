import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_QUERY } from '../callbacks/queries/GetUser.query';
import { GET_USER_BY_ID_QUERY } from '../callbacks/queries/getUserById.query';
import Header from '../components/Header';
import Dock from '../components/Dock';
import { Bell, User, Users, ChevronDown, MessageCircle } from 'react-feather';
import { useParams } from 'react-router-dom';
import { CREATE_ROOM_MUTATION } from '../callbacks/mutations/createRoom.mutation.js'; // Import the mutation
import { backendUrl } from "../config/variables";

const ProfilePage = () => {
  const { id } = useParams();

  let query;
  let variables = {};

  if (id) {
    query = GET_USER_BY_ID_QUERY;
    variables = { userId: Number(id) };
  } else {
    query = GET_USER_QUERY;
  }

  const { loading, error, data } = useQuery(query, {
    variables,
  });

  const [createRoom] = useMutation(CREATE_ROOM_MUTATION); // Add the mutation hook

  if (loading) {
    return <div>Loading...</div>;
  }

  const user = id ? data.getUser : data.currentUser;

  if (!user) {
    return <div>Error 404: User not found</div>;
  }

  const coverPhoto = backendUrl + "/" + user.profileHeaderUrl;
  const avatar = backendUrl + "/" + user.avatarUrl;

  const handleButtonClick = () => {
    createRoom({
      variables: {
        secondMember: id,
      },
    }).then((response) => {
      console.log("created");
    }).catch((error) => {
      // Handle the error if needed
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Моя страница" />
      <div className="profile-page">
        {/* Page Cover */}
        <div className="relative top-19">
          <img
            src={coverPhoto} // Use the cover photo from data
            alt="Profile Cover"
            className="w-full h-64 object-cover"
          />

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-mainPurple py-4 px-4 md:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={avatar} // Use the avatar from data
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
                <div>
                  <h1 className="text-xl font-bold text-usualWhite">John Doe</h1>
                  <p className="text-usualWhite text-sm">@johndoe</p>
                </div>
              </div>
              {data && data.currentUser && (data.currentUser.id === id || !id) ? (
                <button
                  href="/settings" // Replace with your target link
                  className="bg-usualWhite text-mainPurple font-semibold px-4 py-2 rounded-full"
                >
                  Изменить профиль
                </button>
              ) : (
                <button
                  onClick={handleButtonClick} // Call the mutation on button click
                  className="bg-usualWhite text-mainPurple font-semibold px-4 py-2 rounded-full"
                >
                  Написать сообщение
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="bg-white p-4 grid grid-cols-3 gap-4 mt-19 bg-mainPurple">
          <div className="flex flex-col items-center">
            <MessageCircle size={24} className="text-usualWhite" />
            <p className="text-lg font-bold mt-1 text-usualWhite">10</p>
            <p className="text-usualWhite">Записей</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={24} className="text-usualWhite" />
            <p className="text-lg font-bold mt-1 text-usualWhite">100</p>
            <p className="text-usualWhite">Фанатов</p>
          </div>
          <div className="flex flex-col items-center">
            <User size={24} className="text-usualWhite" />
            <p className="text-lg font-bold mt-1 text-usualWhite">50</p>
            <p className="text-usualWhite">Подписок</p>
          </div>
        </div>

        {/* Other Content */}
        {/* Add your own content here */}
      </div>
      <Dock />
    </div>
  );
};

export default ProfilePage;
