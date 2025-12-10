import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export function DropzoneForm({ handleFiles, initialFiles, initialImages }) {
  const [previewFiles, setPreviewFiles] = useState([]);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setPreviewFiles((prevFiles) => [
        ...prevFiles,
        ...initialImages.map((url) => ({
          previewUrl: url
        }))
      ]);
    }
  }, [initialImages]);

  const onDrop = useCallback((acceptedFiles) => {
    handleFiles(acceptedFiles);
    setPreviewFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }))
    ]);
  }, []);

  const deleteFile = (file) => {
    setPreviewFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.file !== file)
    );
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    onDrop,
    multiple: true
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  const fileContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
  };

  const preview = previewFiles.map((previewFile, index) => (
    <div key={index} className="mr-4 text-base ml-5 w-1/8 h-1/8">
      <div className="relative">
        {previewFile.file ? (
          <img
            src={previewFile.previewUrl}
            alt="Image Preview"
            className="rounded-full w-20 h-20 object-cover"
          />
        ) : (
          <img
            src={previewFile.previewUrl}
            alt="Image Preview"
            className="rounded-full w-20 h-20 object-cover"
          />
        )}
        <button
          className="absolute top-0 right-0 mt-2 mr-2 p-1 text-gray-500 hover:text-gray-800"
          onClick={() => deleteFile(previewFile.file)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M13.707 5.293a1 1 0 010 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 011.414-1.414L10 8.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p>{previewFile.file ? previewFile.file.name : 'Image'}</p>
    </div>
  ));

  return (
    <div className="">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Нажмите сюда или перетащите файлы для загрузки</p>
        ) : (
          <p>Нажмите сюда или перетащите файлы для загрузки</p>
        )}
      </div>
      <div className="items-start" style={baseStyle}>
        {preview}
      </div>
    </div>
  );
}
