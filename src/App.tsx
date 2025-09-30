import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { Portfolio } from './pages/Portfolio';
import { FacultyPanel } from './pages/FacultyPanel';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="activities" element={<Activities />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="faculty" element={<FacultyPanel />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;