import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Save, X, Image as ImageIcon } from 'react-feather';
import { EDIT_POST_MUTATION } from '../../callbacks/mutations/editPost.mutation.js';
import { useDropzone } from 'react-dropzone';
import { backendUrl } from '../../config/variables';

const EditPostForm = ({ postId, initialBody = '', initialImages = [], initialImageIds = [] }) => {
  const [body, setBody] = useState(initialBody);
  const [addedFiles, setAddedFiles] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const [editPost, { loading }] = useMutation(EDIT_POST_MUTATION);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setAddedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  const removeAddedFile = (index) => {
    setAddedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const markDeleteOldImage = (imageId) => {
    setDeletedImageIds(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await editPost({
        variables: {
          postId,
          newBody: body,
          files: addedFiles,
          deletedImagesIds: deletedImageIds,
        },
      });

      // Успешно — редирект на ленту
      navigate('/feed');
    } catch (err) {
      // Ошибка — показываем сообщение
      setErrorMessage(err.message || 'Не удалось сохранить изменения');
      console.error(err);
    }
  };

  const displayedImages = [
    ...initialImages
      .filter((_, i) => !deletedImageIds.includes(initialImageIds[i]))
      .map((img, i) => ({ url: `${img}`, id: initialImageIds[i], isOld: true })),
    ...addedFiles.map(file => ({ url: file.preview, isNew: true }))
  ];

  return (
    <div className="bg-base-100 px-4 py-8">
      <div className="card max-w-2xl mx-auto bg-base-200 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body gap-6">
          <h2 className="card-title text-2xl">Редактировать запись</h2>

          {/* Ошибка */}
          {errorMessage && (
            <div className="alert alert-error shadow-lg">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Текстовое поле */}
          <textarea
            className="textarea textarea-bordered textarea-lg w-full h-32"
            placeholder="Что у вас нового?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          {/* Превью изображений */}
          {displayedImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {displayedImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img.url}
                    alt="preview"
                    className="rounded-lg object-cover w-full h-32"
                    onLoad={() => img.isNew && URL.revokeObjectURL(img.url)}
                  />
                  <button
                    type="button"
                    onClick={() => img.isOld ? markDeleteOldImage(img.id) : removeAddedFile(i - (initialImages.length - deletedImageIds.length))}
                    className="absolute top-1 right-1 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary'}`}
          >
            <input {...getInputProps()} />
            <ImageIcon size={48} className="mx-auto text-base-content/40 mb-4" />
            <p className="text-lg">
              {isDragActive ? "Отпустите изображения" : "Добавьте новые изображения"}
            </p>
            <p className="text-sm text-base-content/60 mt-2">
              Перетащите или нажмите (JPG, PNG, GIF)
            </p>
          </div>

          {/* Сохранить */}
          <div className="card-actions justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-wide text-base-100"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <Save size={20} />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostForm;