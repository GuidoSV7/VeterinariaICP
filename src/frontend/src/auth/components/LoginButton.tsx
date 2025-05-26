import { FC } from 'react';
import useStore from '../store/auth.store';

const LoginButton: FC = () => {
  const login = useStore(state => state.login);

  return (
    <button className="auth-button" onClick={login}>
      Login
    </button>
  );
};

export default LoginButton; 