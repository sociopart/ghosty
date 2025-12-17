import React, { useEffect, useState, useRef } from "react";
import { Save, Camera } from "react-feather";
import Header from "../components/Header";
import Dock from "../components/Dock";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "../callbacks/queries/GetUser.query";
import { UPD_AVATAR_MUTATION } from "../callbacks/mutations/updateAvatar.mutation";
import { UPD_HEADER_MUTATION } from "../callbacks/mutations/updateHeader.mutation";
import { backendUrl } from "../config/variables";

const ProfileSettingsPage = () => {
  const { loading, error, data } = useQuery(GET_USER_QUERY);

  const [coverPreview, setCoverPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [hasChanges, setHasChanges] = useState(false); // Флаг изменений
  const [message, setMessage] = useState({ text: "", type: "" });

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [uploadAvatar] = useMutation(UPD_AVATAR_MUTATION);
  const [uploadHeader] = useMutation(UPD_HEADER_MUTATION);

  useEffect(() => {
    if (data?.currentUser) {
      const headerUrl = data.currentUser.profileHeaderUrl
        ? `${backendUrl}/${data.currentUser.profileHeaderUrl}`
        : "";
      const avatarUrl = data.currentUser.avatarUrl
        ? `${backendUrl}/${data.currentUser.avatarUrl}`
        : "https://i.pravatar.cc/300";

      setCoverPreview(headerUrl);
      setAvatarPreview(avatarUrl);
      setHasChanges(false);
    }
  }, [data]);

  const dataURLtoFile = (dataUrl, filename) => {
    if (!dataUrl || !dataUrl.startsWith("data:")) return null;
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileChange = (file, setPreview) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e, setPreview) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file, setPreview);
    }
  };

  const handleSave = async () => {
    setMessage({ text: "", type: "" });

    const avatarFile = dataURLtoFile(avatarPreview, "avatar.jpg");
    const headerFile = dataURLtoFile(coverPreview, "cover.jpg");

    try {
      if (avatarFile) await uploadAvatar({ variables: { avatar: avatarFile } });
      if (headerFile) await uploadHeader({ variables: { profile_header: headerFile } });

      setMessage({ text: "Изменения успешно сохранены", type: "success" });
      setHasChanges(false);
    } catch (err) {
      setMessage({ text: err.message || "Ошибка сохранения", type: "error" });
    }
  };

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
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pb-20 md:pb-0">
      <Header title="Настройки профиля" />

      <div className="container max-w-3xl mx-auto px-4 pt-4">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body gap-6">
            {/* Обложка */}
            <div
              className="relative group rounded-xl overflow-hidden"
              onDrop={(e) => handleDrop(e, setCoverPreview)}
              onDragOver={(e) => e.preventDefault()}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Обложка"
                  className="w-full h-48 md:h-64 object-cover"
                />
              ) : (
                <div className="w-full h-48 md:h-64 bg-base-300 flex items-center justify-center">
                  <span className="text-2xl text-base-content/50">
                    Перетащите обложку сюда
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="btn btn-circle btn-primary text-base-100"
                >
                  <Camera size={24} />
                </button>
              </div>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0], setCoverPreview)}
              />
            </div>

            {/* Аватар */}
            <div className="flex justify-center -mt-16 md:-mt-20">
              <div
                className="relative group"
                onDrop={(e) => handleDrop(e, setAvatarPreview)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="avatar">
                  <div className="w-32 md:w-40 rounded-full ring ring-base-200 ring-offset-base-100 ring-offset-4">
                    <img src={avatarPreview} alt="Аватар" />
                  </div>
                </div>

                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition"
                >
                  <Camera size={28} className="text-white" />
                </button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0], setAvatarPreview)}
                />
              </div>
            </div>

            {/* Имя */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Имя</span>
              </label>
              <input
                type="text"
                placeholder="Ваше имя"
                className="input input-bordered"
                defaultValue={data.currentUser.name || ""}
              />
            </div>

            {/* Сообщение */}
            {message.text && (
              <div className={`alert alert-${message.type === "success" ? "success" : "error"} shadow-lg`}>
                <span>{message.text}</span>
              </div>
            )}

            {/* Сохранить */}
            <div className="card-actions justify-center">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="btn btn-primary btn-wide text-base-100"
              >
                <Save size={20} />
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dock />
    </div>
  );
};

export default ProfileSettingsPage;