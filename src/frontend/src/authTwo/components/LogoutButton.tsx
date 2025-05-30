import { FC } from 'react';
import useStore from '../store/auth.store';

const LogoutButton: FC = () => {
  const logout = useStore(state => state.logout);

  return (
    <button className="auth-button" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton; 