import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Save } from 'react-feather';
import { EDIT_POST_MUTATION } from '../../callbacks/mutations/editPost.mutation.js';
import { DropzoneEditForm } from '../forms/DropzoneEditForm.jsx';
import './../../../src/public/css/tailwind.css';
import './../../assets/css/custom.css';

const EditPostForm = ({ postId, initialBody, initialImages, initialImageIds }) => {
  const [body, setBody] = useState(initialBody);
  const [addedFiles, setAddedFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  
  const [editPost] = useMutation(EDIT_POST_MUTATION);

  const handleTextChange = (event) => {
    setBody(event.target.value);
  };

  const handleFiles = (acceptedFiles) => {
    setAddedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  useEffect(() => {
    console.log(deletedImages);
  }, [deletedImages]);

  const handleDeleteImage = (imageId) => {
    setDeletedImages((prevDeletedImages) => [...prevDeletedImages, imageId]);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    editPost({
      variables: {
        postId: postId,
        newBody: body,
        files: addedFiles,
        deletedImagesIds: deletedImages,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="py-16">
      <div className="mb-4">
        <textarea
          type="text"
          id="body"
          name="body"
          value={body}
          className="block w-full px-4 py-2"
          onChange={handleTextChange}
        />
      </div>
      <DropzoneEditForm
        handleFiles={handleFiles}
        initialImages={initialImages}
        handleDeleteImage={handleDeleteImage}
        initialImageIds={initialImageIds}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </button>
    </form>
  );
};

export default EditPostForm;
