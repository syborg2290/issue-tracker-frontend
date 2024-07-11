import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Layout } from "antd";
import { AuthProvider, isTokenExpired } from "./contexts/AuthContext";
import { IssuesProvider } from "./contexts/IssuesContext";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./components/NotFoundPage";
import useAuth from "./hooks/useAuth";
import IssuesList from "./components/IssuesList";
import { UserProvider } from "./contexts/UserContext";

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <AuthProviderWithNavigate>
          <IssuesProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={<PrivateRoute />}>
                  <Route path="/profile" element={<UserProfile />} />
                </Route>

                <Route path="/issues" element={<PrivateRoute />}>
                  <Route path="" element={<IssuesList />} />
                </Route>

                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </UserProvider>
          </IssuesProvider>
        </AuthProviderWithNavigate>
      </Layout>
    </Router>
  );
};

const AuthProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

export default App;

const HomeRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isTokenExpired(localStorage.getItem("token") || "")) {
      navigate("/issues");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null; // Render nothing while redirecting
};
