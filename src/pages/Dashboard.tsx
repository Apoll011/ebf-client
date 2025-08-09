import React from "react";
import Header from "../components/Header.tsx";
import {withAuth} from "../api/useAuth.tsx";

// eslint-disable-next-line react-refresh/only-export-components
const DashboardPage: React.FC = () => {
    return (
        <div>
            <Header />
            <h1>Dashboard</h1>

        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(DashboardPage);