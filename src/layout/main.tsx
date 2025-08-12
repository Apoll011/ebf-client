import Header from "../components/Header.tsx";
import {useAuth} from "../hooks/useAuth.tsx";
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
      <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <div className="min-h-screen  mb-4">
              {children}
          </div>
          <footer className="w-full justify-center  flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-gray p-6 bg-white shadow-sm border-t border-gray-500 text-center md:justify-between">
              <p className="font-normal text-blue-gray-500 text-sm">
                  &copy; 2025 <strong>@Embrace</strong> by Tiago Inês &nbsp;|&nbsp; <em>1 Coríntios 10:31</em> — Portanto, quer comais, quer bebais, ou façais qualquer outra coisa, fazei tudo para a glória de Deus.
              </p>
          </footer>
      </div>
    );
};