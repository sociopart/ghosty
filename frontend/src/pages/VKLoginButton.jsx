import React from 'react';
import VK from 'vk-openapi';

class VKLoginButton extends React.Component {
  componentDidMount() {
    VK.init({
      apiId: 51654680 // Replace with your VK app ID
    });
  }

  handleLogin = () => {
    VK.Auth.login(response => {
      if (response.session) {
        const { session } = response;

        // User is logged in successfully
        console.log('Session:', session);

        VK.Api.call('users.get', { fields: 'email' }, data => {
          if (data.response) {
            const { email } = data.response[0];

            // Email address obtained
            console.log('Email:', email);
          } else {
            // Email retrieval failed
            console.error('Failed to retrieve email address');
          }
        });
      } else {
        // Login failed
        console.error('VK login failed');
      }
    }, VK.access.EMAIL);
  };

  render() {
    return (
      <button onClick={this.handleLogin} className="bg-mainPurple hover:bg-usualWhite hover:text-mainPurple text-usualWhite text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300" type="button">
        ВОЙТИ ЧЕРЕЗ VK
      </button>
    );
  }
}

export default VKLoginButton;
