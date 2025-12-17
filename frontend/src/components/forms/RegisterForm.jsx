import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { SIGN_UP_MUTATION } from '../../callbacks/mutations/signUp.mutation.js';
import Cookies from 'js-cookie';

// Images
import logoIcon from "./../../assets/images/logo.svg";
import logoText from "./../../assets/images/logo-text.svg";
import vkButton from "./../../assets/images/sign-in__vk.svg";
import okButton from "./../../assets/images/sign-in__ok.svg";
import goButton from "./../../assets/images/sign-in__gos.svg";

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [registerUser, { loading }] = useMutation(SIGN_UP_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    try {
      const { data } = await registerUser({
        variables: { email, password },
      });

      if (data.signUp.accessToken) {
        Cookies.set('token', data.signUp.accessToken);
        navigate('/feed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Ошибка регистрации');
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Подтвердите пароль</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="alert alert-error shadow-lg">
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4 text-base-100"
            >
              {loading ? <span className="loading loading-spinner"></span> : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-base-content/60">или</div>

          {/* Social buttons */}
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

          {/* Login link */}
          <div className="text-center text-base-content/80">
            Уже есть аккаунт?{' '}
            <a href="/" className="link link-primary font-medium">
              Войти
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;