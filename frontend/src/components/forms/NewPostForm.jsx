import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Save, X, Image as ImageIcon } from "react-feather";
import { CREATE_POST_MUTATION } from '../../callbacks/mutations/createPost.mutation.js';
import { useDropzone } from 'react-dropzone';

const QUEUE_KEY = 'pendingPosts';

const NewPostForm = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);

  // Отслеживание статуса сети
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

  // Синхронизация очереди при восстановлении соединения
  useEffect(() => {
    if (!isOnline) return;

    const syncQueue = async () => {
      let pending = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      if (pending.length === 0) return;

      for (let i = 0; i < pending.length; i++) {
        const entry = pending[i];
        try {
          // Восстановление File объектов из base64
          const restoredFiles = await Promise.all(
            entry.fileBlobs.map(async ({ name, type, base64 }) => {
              const blob = await fetch(base64).then(r => r.blob());
              return new File([blob], name, { type });
            })
          );

          await createPost({
            variables: {
              body: entry.text,
              files: restoredFiles
            }
          });

          // Удаление успешно отправленного элемента
          pending = pending.filter(p => p.id !== entry.id);
          localStorage.setItem(QUEUE_KEY, JSON.stringify(pending));
        } catch (err) {
          console.error('Sync failed for post:', entry.id, err);
          break;
        }
      }
    };

    syncQueue();
  }, [isOnline, createPost]);

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

  // Удаление файла из превью и освобождение памяти
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(files[index].preview);
  };

  // Сохранение поста в очередь localStorage
  const enqueuePost = (text, files) => {
    const pending = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    
    const entry = {
      id: Date.now() + Math.random(),
      text,
      fileBlobs: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: ''
      }))
    };

    const promises = files.map(file => 
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      })
    );

    Promise.all(promises).then(base64Array => {
      entry.fileBlobs = entry.fileBlobs.map((meta, i) => ({
        ...meta,
        base64: base64Array[i]
      }));
      pending.push(entry);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(pending));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && files.length === 0) return;

    if (isOnline) {
      try {
        await createPost({
          variables: { body: text, files }
        });
        setText('');
        setFiles([]);
        files.forEach(f => URL.revokeObjectURL(f.preview));
      } catch (err) {
        console.error('Online submit failed:', err);
        enqueuePost(text, files);
      }
    } else {
      enqueuePost(text, files);
      setText('');
      setFiles([]);
      files.forEach(f => URL.revokeObjectURL(f.preview));
      setShowOfflineModal(true);
    }
  };

  return (
    <div className="bg-base-100 px-4 py-8">
      <div className="card max-w-2xl mx-auto bg-base-200 shadow-xl">
        <form onSubmit={handleSubmit} className="card-body mt-5 gap-6">
          <textarea
            className="textarea textarea-bordered textarea-lg w-full h-32"
            placeholder="Что у вас нового?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required={files.length === 0}
          />

          {files.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={file.preview}
                    alt="preview"
                    className="rounded-lg object-cover w-full h-32"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
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

      <dialog className="modal" open={showOfflineModal}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Пост сохранён локально</h3>
          <p className="py-4">Нет интернета. Ваш пост будет автоматически отправлен, как только соединение восстановится.</p>
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

export default NewPostForm;