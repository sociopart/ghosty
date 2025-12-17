import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Save, X, Image as ImageIcon } from "react-feather";
import { CREATE_POST_MUTATION } from '../../callbacks/mutations/createPost.mutation.js';
import { useDropzone } from 'react-dropzone';

const NewPostForm = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]); // массив файлов с превью

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    // Освобождаем память от objectURL
    URL.revokeObjectURL(files[index].preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && files.length === 0) return;

    try {
      await createPost({
        variables: {
          body: text,
          files: files // Apollo сам обработает FileList/File через multipart
        }
      });
      setText('');
      setFiles([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-base-100 px-4 py-8">
      <div className="card max-w-2xl mx-auto bg-base-200 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body mt-5 gap-6">
          {/* Текстовое поле */}
          <textarea
            className="textarea textarea-bordered textarea-lg w-full h-32"
            placeholder="Что у вас нового?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required={files.length === 0}
          />

          {/* Превью изображений */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={file.preview}
                    alt="preview"
                    className="rounded-lg object-cover w-full h-32"
                    onLoad={() => URL.revokeObjectURL(file.preview)} // чистим после загрузки
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
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
              {isDragActive
                ? "Отпустите изображения здесь"
                : "Перетащите изображения или нажмите для выбора"}
            </p>
            <p className="text-sm text-base-content/60 mt-2">
              Поддерживаются JPG, PNG, GIF
            </p>
          </div>

          {/* Кнопка отправки */}
          <div className="card-actions justify-center">
            <button
              type="submit"
              disabled={loading || (!text.trim() && files.length === 0)}
              className="btn btn-primary btn-wide text-base-100"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <Save size={20} />
                  Опубликовать
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostForm;