import { useAuthStore } from 'auth/store/auth.store';
import { FC } from 'react';

const LoginButton: FC = () => {

    const { 
    login

   } = useAuthStore();

  return (
    <button className="auth-button" onClick={login}>
      Login
    </button>
  );
};

export default LoginButton; 