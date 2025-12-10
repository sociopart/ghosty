import React, { useEffect, useState } from "react";
import { Save, Camera } from "react-feather";
import Header from "../components/Header";
import Dock from "../components/Dock";
import { useMutation, useQuery } from "@apollo/client";
import { accessToken, backendUrl } from "../config/variables";
import GetUser, { GET_USER_QUERY } from "../callbacks/queries/GetUser.query";
import { UPD_AVATAR_MUTATION } from "../callbacks/mutations/updateAvatar.mutation";
import { UPD_HEADER_MUTATION } from "../callbacks/mutations/updateHeader.mutation";

const ProfileSettingsPage = () => {
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { accessToken },
  });

  const [coverPhoto, setCoverPhoto] = useState("");
  const [avatar, setAvatar] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [headerChanged, setHeaderChanged] = useState(false);

  useEffect(() => {
    if (!loading && data) {
      setCoverPhoto(backendUrl + data.currentUser.profileHeaderUrl);
      setAvatar(backendUrl + data.currentUser.avatarUrl);
    }
  }, [loading, data]);

  const [uploadAvatarMutation] = useMutation(UPD_AVATAR_MUTATION);
  const [updateProfileHeaderMutation] = useMutation(UPD_HEADER_MUTATION);

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhoto(e.target.result);
        setHeaderChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        setAvatarChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhoto(e.target.result);
        setHeaderChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        setAvatarChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = (file) => {
    uploadAvatarMutation({ variables: { avatar: file } })
      .then((response) => {
        const { success, errors } = response.data.updateAvatar;
        if (success) {
          setSuccessMessage("Аватар успешно сохранен");
        } else {
          setSuccessMessage(`Ошибка сохранения аватара: ${errors}`);
        }
      })
      .catch((error) => {
        setSuccessMessage(`Ошибка сохранения аватара: ${error.message}`);
      });
  };

  const uploadProfileHeader = (file) => {
    updateProfileHeaderMutation({ variables: { profile_header: file } })
      .then((response) => {
        const { success, errors } = response.data.updateProfileHeader;
        if (success) {
          setSuccessMessage("Обложка успешно сохранена");
        } else {
          setSuccessMessage(`Ошибка сохранения обложки: ${errors}`);
        }
      })
      .catch((error) => {
        setSuccessMessage(`Ошибка сохранения обложки: ${error.message}`);
      });
  };

  const handleSave = () => {
    if (avatarChanged) {
      uploadAvatar(dataURLtoFile(avatar, "avatar.jpg"));
    }
    if (headerChanged) {
      uploadProfileHeader(dataURLtoFile(coverPhoto, "coverPhoto.jpg"));
    }
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    if (arr[0] && arr[0].match) {
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    return null;
  };

  // Render loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error if any
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Header title="Настройки" />

      <div className="profile-settings-page mt-24">
        <div className="bg-white rounded-lg p-4">
          {/* Cover Photo */}
          <div
            className="relative"
            onDrop={handleCoverPhotoDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-usualWhite p-2 cursor-pointer flex items-center"
              onClick={() => {
                document.getElementById("coverPhotoInput").click();
              }}
            >
              <Camera size={16} className="center mr-1" />
              <div className="text-md text-gray-600 ml-1">Изменить обложку...</div>
            </button>
            <input
              id="coverPhotoInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
            <img
              src={coverPhoto}
              alt="Cover Photo"
              className="w-full h-40 sm:h-56 object-cover rounded-t-lg rounded-b-lg"
            />
          </div>

          {/* Avatar */}
          <div
            className="flex flex-col items-center mt-4"
            onDrop={handleAvatarDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <button
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white"
              onClick={() => {
                document.getElementById("avatarInput").click();
              }}
            >
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            </button>
            <label
              htmlFor="avatarInput"
              className="text-blue-500 cursor-pointer hover:underline mt-2 flex items-center"
            >
              <Camera size={16} className="mr-1" />
              Изменить аватар...
            </label>
            <input
              id="avatarInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name */}
          <div className="mt-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-1"
            >
              Имя
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Имя пользователя"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-mainPurple text-usualWhite font-semibold px-4 py-2 rounded-md flex items-center"
              onClick={handleSave}
            >
              <Save size={16} className="mr-1" />
              Сохранить
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-600 mt-4">{successMessage}</div>
          )}
        </div>
      </div>
      <Dock/>
    </div>
  );
};

export default ProfileSettingsPage;
