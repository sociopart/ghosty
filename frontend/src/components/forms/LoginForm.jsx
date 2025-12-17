import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGN_IN_MUTATION } from '../../callbacks/mutations/signIn.mutation.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Images
import logoIcon from "./../../assets/images/logo.svg";
import logoText from "./../../assets/images/logo-text.svg";
import vkButton from "./../../assets/images/sign-in__vk.svg";
import okButton from "./../../assets/images/sign-in__ok.svg";
import goButton from "./../../assets/images/sign-in__gos.svg";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { loading, error }] = useMutation(SIGN_IN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: { email, password },
      });
      Cookies.set('token', data.signIn.accessToken);
      navigate('/feed');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-8">
      <div className="card w-full max-w-md shadow-xl bg-base-200">
        <div className="card-body gap-6">
          {/* Logo */}
          <div className="flex justify-center items-center gap-3">
            <img src={logoIcon} alt="G" className="w-12 h-12" />
            <img src={logoText} alt="Ghosty" className="h-8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Электронная почта</span>
              </label>
              <input
                type="email"
                placeholder="example@mail.ru"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Пароль</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4 text-base-100"
            >
              {loading ? <span className="loading loading-spinner"></span> : 'ВОЙТИ'}
            </button>

            {/* Забыли пароль */}
            {/* <div className="text-center">
              <a href="#" className="link link-primary text-sm">Напомнить пароль</a>
            </div> */}
          </form>

          {/* Разделитель "или" */}
          <div className="divider text-base-content/60">или</div>

          {/* Кнопки соцсетей */}
          <div className="grid grid-cols-3 gap-3">
            <button className="btn btn-outline btn-primary">
              <img src={vkButton} alt="VK" className="h-8" />
            </button>
            <button className="btn btn-outline btn-primary">
              <img src={okButton} alt="OK" className="h-8" />
            </button>
            <button className="btn btn-outline btn-primary">
              <img src={goButton} alt="Госуслуги" className="h-8" />
            </button>
          </div>

          {/* Регистрация */}
          <div className="text-center text-base-content/80">
            Нет аккаунта?{' '}
            <a href="/register" className="link link-primary font-medium">
              Зарегистрируйтесь
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;