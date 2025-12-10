import React from "react";
import Header from "../components/Header";
import Dock from "../components/Dock";
import NewPostForm from "../components/forms/NewPostForm";
import './../../src/public/css/tailwind.css';

export class NewPostPageComponent extends React.Component {
  render() {
    return (
      <div className="h-screen bg-usualWhite">
        <Header title="Новая запись"/>
        <div className="flex-1 y-2 md:py-4 lg:py-8 xl:py-12 bg-usualWhite top-19">
          <NewPostForm/>
        </div>
       
        <Dock/>
      </div>
    );
  }
}