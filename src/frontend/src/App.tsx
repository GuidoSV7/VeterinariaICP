import { FC, FormEvent, useEffect } from 'react';
import LoginButton from './auth/components/LoginButton';
import LogoutButton from './auth/components/LogoutButton';
import useStore from './auth/store/auth.store';

import logo from './logo.svg';
import './App.css';

const App: FC = () => {
  const { 
    isAuthenticated, 
    names, 
    name, 
    setName, 
    addName,
    initAuth,
    getNames 
  } = useStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      getNames();
    }
  }, [isAuthenticated, getNames]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addName();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </header>
      <main>
        <h1>Names</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
          <button className="button" type="submit">
            Add Name
          </button>
        </form>

        <ul className="name-list">
          {names.map((name, index) => (
            <li className="name-item" key={index}>
              {name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App; 