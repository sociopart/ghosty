import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { SIGN_UP_MUTATION } from '../../callbacks/mutations/signUp.mutation.js';
import { railsToken } from '../../config/variables.js';
import Cookies from 'js-cookie';

// Images and so on ============================================================
import './../../assets/css/pages/sign_in.css'
import logoIcon from "./../../assets/images/logo.svg"
import logoText from "./../../assets/images/logo-text.svg"
import vkButton from "./../../assets/images/sign-in__vk.svg"
import okButton from "./../../assets/images/sign-in__ok.svg"
import goButton from "./../../assets/images/sign-in__gos.svg"
// =============================================================================

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerUser, { loading, error }] = useMutation(SIGN_UP_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var { data } = await registerUser({
        variables: { email, password },
        railsToken
      });
      if (data.signUp.accessToken) {
        Cookies.set('token', data.signUp.accessToken);
        navigate('/feed'); // Redirect to feed page
      }
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
        
        <button type="submit" disabled={loading} className="button bg-btn-blue text-white font-bold">ЗАРЕГИСТРИРОВАТЬСЯ</button>

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
          Уже есть аккаунт?
          <a className="text-btn-blue" href="/"> Войти  </a>
      </span>
      
    </div>
    // <body className="landing-gradient flex flex-col h-screen justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32">
    //   {/* Logo */}
    //   <div className="mb-6">
    //     <img
    //       src=""
    //       className="fill-current text-blue-500"
    //       alt="SVG image"
    //     />
    //   </div>
    //   <div className="flex flex-col justify-start w-4/5 h-screen mx-auto">
    //     {/* Email input */}
    //     <div className="flex mb-4 w-full">
    //       <input
    //         id="email"
    //         type="email"
    //         className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-usualWhite leading-tight focus:outline-none focus:shadow-outline bg-mainPurple border-usualWhite border-1.44 h-10 md:h-50"
    //         placeholder="Электронная почта"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //     </div>
    //     {/* Password input */}
    //     <div className="mb-4 w-full">
    //       <input
    //         id="password"
    //         type="password"
    //         className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-usualWhite leading-tight focus:outline-none focus:shadow-outline bg-mainPurple border-usualWhite border-1.44 h-10 md:h-50"
    //         placeholder="Пароль"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>
    //     {/* Forgot password link */}
    //     <div className="mb-6 text-right">
    //       <a href="#" className="text-usualWhite hover:text-usualWhite">
    //         Забыли пароль?
    //       </a>
    //     </div>
    //     <div className="flex-1 items-end justify-end">
    //       <div className="mb-6 h-px bg-usualWhite self-center mx-auto"></div>
    //       {/* Registration form */}
    //       <form onSubmit={handleSubmit}>
    //         <div className="mb-6 text-center mt-auto">
    //           <button
    //             className="bg-mainPurple hover:bg-usualWhite hover:text-mainPurple text-usualWhite text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
    //             type="submit"
    //             disabled={loading}
    //           >
    //             ЗАРЕГИСТРИРОВАТЬСЯ
    //           </button>
    //         </div>
    //         {error && <p>{error.message}</p>}
    //         </form>
    //     </div>
    //   </div>
    // </body>
  );
};

export default RegisterForm;
