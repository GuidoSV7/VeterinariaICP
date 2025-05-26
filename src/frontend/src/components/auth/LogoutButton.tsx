import useStore from "../../stores/useStore";
import { FC } from 'react';

const LogoutButton: FC = () => {
  const logout = useStore(state => state.logout);

  return (
    <button className="auth-button" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton; 