import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_QUERY } from '../callbacks/queries/GetUser.query';
import { GET_USER_BY_ID_QUERY } from '../callbacks/queries/getUserById.query';
import { CREATE_ROOM_MUTATION } from '../callbacks/mutations/createRoom.mutation.js';
import Header from '../components/Header';
import Dock from '../components/Dock';
import { MessageCircle, Users, UserPlus } from 'react-feather';
import { useParams } from 'react-router-dom';
import { backendUrl } from "../config/variables";

const ProfilePage = () => {
  const { id } = useParams();

  const query = id ? GET_USER_BY_ID_QUERY : GET_USER_QUERY;
  const variables = id ? { userId: Number(id) } : {};

  const { loading, error, data } = useQuery(query, { variables });
  const [createRoom] = useMutation(CREATE_ROOM_MUTATION);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <span>Ошибка загрузки профиля</span>
      </div>
    );
  }

  const isOwnProfile = !id || data.currentUser?.id === Number(id);
  const user = id ? data.getUser : data.currentUser;

  if (!user) {
    return (
      <div className="alert alert-warning shadow-lg max-w-md mx-auto mt-8">
        <span>Пользователь не найден</span>
      </div>
    );
  }

  const coverPhoto = user.profileHeaderUrl ? `${backendUrl}/${user.profileHeaderUrl}` : null;
  const avatar = user.avatarUrl ? `${backendUrl}/${user.avatarUrl}` : "https://i.pravatar.cc/300";

  const handleMessage = async () => {
    try {
      await createRoom({ variables: { secondMember: Number(id) } });
      // добавить navigate(`/im/${roomId}`) после получения ID комнаты
      console.log("Чат создан");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 pb-20 md:pb-0">
      <Header title={isOwnProfile ? "Моя страница" : "Профиль"} />

      <div className="relative">
        {/* Обложка */}
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Обложка профиля"
            className="w-full h-48 md:h-64 object-cover"
          />
        ) : (
          <div className="w-full h-48 md:h-64 bg-gradient-to-b from-primary to-primary/60" />
        )}

        {/* Аватар и информация */}
        <div className="absolute inset-x-0 -bottom-12 md:-bottom-16 flex justify-center">
          <div className="avatar">
            <div className="w-32 md:w-40 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4">
              <img src={avatar} alt="Аватар" />
            </div>
          </div>
        </div>
      </div>

      {/* Основная карточка профиля */}
      <div className="pt-20 md:pt-28 px-4">
        <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto -mt-8 md:-mt-12">
          <div className="card-body items-center text-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">{user.name || user.email}</h1>
            <p className="text-base-content/70">@{user.username || 'username'}</p>

            {/* Кнопка действия */}
            {isOwnProfile ? (
              <a href="/settings" className="btn btn-outline btn-primary text-base-100">
                Изменить профиль
              </a>
            ) : (
              <button onClick={handleMessage} className="btn btn-primary text-base-100">
                <MessageCircle size={20} />
                Написать сообщение
              </button>
            )}

            {/* Статистика */}
            <div className="stats stats-vertical md:stats-horizontal shadow w-full mt-6">
              <div className="stat place-items-center">
                <div className="stat-title">Записей</div>
                <div className="stat-value text-primary">10</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Фанатов</div>
                <div className="stat-value text-secondary">100</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Подписок</div>
                <div className="stat-value text-accent">50</div>
              </div>
            </div>

            {/* Посты пользователя */}
            <div className="divider mt-8">Записи</div>
            <div className="text-center text-base-content/60 py-8">
              Пока нет записей
            </div>
          </div>
        </div>
      </div>

      <Dock />
    </div>
  );
};

export default ProfilePage;