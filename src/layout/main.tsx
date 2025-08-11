import Header from "../components/Header.tsx";
import {useAuth} from "../api/useAuth.tsx";
import {useNavigate} from "react-router-dom";

export const MainLayout = ({children}) => {
    const { isAuthenticated, isLoading } = useAuth();

    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        navigate('/login');
    }

    return (
      <>
          <Header />
          <div className="min-h-screen bg-gray-50">
              {children}
          </div>
          <footer></footer>
      </>
    );
};