import React from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../api/useAuth.tsx";

const Header: React.FC = () => {
    const { isAuthenticated, user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <header>
            <nav>
                {isAuthenticated ? (
                    <>
                        <Link to="/register">Registar Estudante</Link>
                        <Link to="/student">Estudante</Link>
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;