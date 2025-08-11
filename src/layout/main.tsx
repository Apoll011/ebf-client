import Header from "../components/Header.tsx";
import {useAuth} from "../api/useAuth.tsx";
import {useNavigate} from "react-router-dom";
import React from "react";

export const MainLayout = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated, isLoading } = useAuth();

    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        navigate('/login');
    }

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <div className="min-h-screen  mb-4">
              {children}
          </div>
          <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-gray p-6 bg-white shadow-sm border-t border-gray-500 text-center md:justify-between">
              <p className="font-normal text-blue-gray-500 text-sm">
                  &copy; 2025 @Embrace by Tiago Ines
              </p>
          </footer>
      </div>
    );
};