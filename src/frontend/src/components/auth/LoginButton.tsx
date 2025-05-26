import useStore from "../../stores/useStore";
import { FC } from 'react';

const LoginButton: FC = () => {
  const login = useStore(state => state.login);

  return (
    <button className="auth-button" onClick={login}>
      Login
    </button>
  );
};

export default LoginButton; 