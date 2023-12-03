import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { getUser } from './lib/auth';
import { apolloClient } from './lib/graphql/queries';

import NavBar from './components/NavBar';
import CompanyPage from './pages/CompanyPage';
import CreateJobPage from './pages/CreateJobPage';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/LoginPage';
import { User } from './types/auth.interface';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getUser);

  const handleLogin = (user: User | null) => {
    setUser(user);
    navigate('/')
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/')
  };

  return (
    <ApolloProvider client={apolloClient}>
      <NavBar user={user} onLogout={handleLogout} />
      <main className="section">
        <Routes>
          <Route index path="/"
            element={<HomePage />}
          />
          <Route path="/companies/:companyId"
            element={<CompanyPage />}
          />
          <Route path="/jobs/new"
            element={<CreateJobPage />}
          />
          <Route path="/jobs/:jobId"
            element={<JobPage />}
          />
          <Route path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </main>
    </ApolloProvider>
  );
}

export default App;
