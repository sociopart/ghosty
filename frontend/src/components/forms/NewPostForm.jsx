import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Save } from "react-feather";
import { CREATE_POST_MUTATION } from '../../callbacks/mutations/createPost.mutation.js';
import {DropzoneForm} from '../forms/DropzoneForm.jsx';
import './../../../src/public/css/tailwind.css';
import './../../assets/css/custom.css';

const NewPostForm = () => {
    const [date, setDate] = useState(new Date);
    const [name, setName] = useState('');
    const [files, setFiles] = useState([]); // Initialize as an empty array
  
    const [addEvent] = useMutation(CREATE_POST_MUTATION);
  
    const handleDateChange = (date) => {
      setDate(date.target.value);
    };
  
    const handleSubmit = (evt) => {
      evt.preventDefault();
      addEvent({ variables: { body: name, files: files } }); // Pass the files array
    };
  
    const handleTextChange = (event) => {
      setName(event.target.value);
    };
  
    const handleFiles = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };
  
    return (
      <form onSubmit={handleSubmit} className="py-16">
        <div className="mb-4">
          <textarea
            type="text"
            id="name"
            name="name"
            value={name}
            className="block w-full px-4 py-2"
            onChange={handleTextChange}
          />
        </div>
        <DropzoneForm handleFiles={handleFiles} />
        <br />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-mainPurple text-usualWhite font-semibold px-4 py-2 rounded-md flex items-center"
            style={{ marginTop: '1.5rem' }}
          >
            <Save size={16} className="mr-1" />
            Сохранить
          </button>
        </div>

      </form>
    );
  };
  

export default NewPostForm;
