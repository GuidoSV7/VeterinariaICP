import { useAuthStore } from 'auth/store/auth.store';
import { FC } from 'react';


const LogoutButton: FC = () => {
      const { 
      logout
  
     } = useAuthStore();

  return (
    <button className="auth-button" onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton; 