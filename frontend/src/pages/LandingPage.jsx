import RegisterForm from "../components/forms/RegisterForm";
import LoginForm from "../components/forms/LoginForm";
import UserInfoForm from "../components/forms/UserInfoForm";
import './../../src/public/css/tailwind.css';
import './../assets/css/custom.css';
import './../assets/css/pages/sign_in.css'
import React from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import VKLoginButton from './VKLoginButton';

export class LandingPageComponent extends React.Component {
  state = {
    currentPage: 'some'
  };

  loadLoginPage = () => {
    this.setState({ currentPage: 'login' });
  };

  loadRegisterPage = () => {
    this.setState({ currentPage: 'register' });
  };
  
  authenticateViaVk = () => {
    const redirectUri = 'https://d8a3-95-84-47-5.ngrok-free.app'; // Replace with your actual redirect_uri
    const url = `https://oauth.vk.com/authorize?client_id=51654680&redirect_uri=${redirectUri}&response_type=code&scope=email`;
  
    axios
      .get(`${url}`, 
      { 
        responseType: 'document',
        headers: {
          'Access-Control-Allow-Origin': redirectUri, 
        }, 
      }) 
      .then(response => {
        const responseUrl = response.request.responseURL; 
  
        if (responseUrl) {
          window.location.href = responseUrl; 
        } else {
          console.error('Response URL is not available');
        }
      })
      .catch(error => {
        // Handle the error
        console.error(error);
      });
  };


  render() {
    return <div>{<LoginForm/>}</div>;
  }

}