import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGN_IN_MUTATION } from '../../callbacks/mutations/signIn.mutation.js';
import { railsToken } from '../../config/variables.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Images and so on ============================================================
import './../../assets/css/pages/sign_in.css'
import logoIcon from "./../../assets/images/logo.svg"
import logoText from "./../../assets/images/logo-text.svg"
import vkButton from "./../../assets/images/sign-in__vk.svg"
import okButton from "./../../assets/images/sign-in__ok.svg"
import goButton from "./../../assets/images/sign-in__gos.svg"
// =============================================================================

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { loading, error }] = useMutation(SIGN_IN_MUTATION);
  const navigate = useNavigate(); // Add useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: { email, password },
        railsToken
      });
      Cookies.set('token', data.signIn.accessToken);
      navigate('/feed'); // Redirect to "/feed" upon successful login
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="__sign-in">
      <div className="_logo">
          <img src={logoIcon} alt="G"></img>
          <img src={logoText} alt="Ghosty"></img>
      </div>

      <form className="_form" onSubmit={handleSubmit}>
        <input 
          id="email" 
          type="email" 
          value={email} 
          className="_data_input" 
          placeholder="Электронная почта"
          style={{ paddingLeft: '12px', padding: '8px' }} 
          onChange={(e) => setEmail(e.target.value)}>
        </input>

        <input 
          id="password" 
          type="password" 
          value={password} 
          className="_data_input" 
          placeholder="Пароль"
          style={{ paddingLeft: '12px', padding: '8px' }} 
          onChange={(e) => setPassword(e.target.value)}>
        </input>
        
        <button type="submit" className="button bg-btn-blue text-white font-bold">ВОЙТИ</button>

          {/*<a className="_text-link text-btn-blue" href="">Напомнить пароль</a>*/}
      </form>

      <div className="_justify-ors text-dark-blue">
          <div className="_or"></div>
          или
          <div className="_or"></div>
      </div>


      <div className="_links">
          <button className="button btn-vk">
              <img className="pic-in-btn" src={vkButton} alt="VK"/>
          </button>
          <button className="button btn-ok">
              <img className="pic-in-btn" src={okButton} alt="OK"/>
          </button>
          <button className="button btn-gos">
              <img className="pic-in-btn" src={goButton} alt="GOS"/>
          </button>
      </div>


      <span className="text-dark-blue">
          Нет аккаунта?
          <a className="text-btn-blue" href="/register"> Зарегистрируйтесь</a>
      </span>
      
    </div>
  );
};

export default LoginForm;
