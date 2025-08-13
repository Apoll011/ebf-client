import { Navigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.tsx";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    ignoreViewer?: boolean;
}

export function ProtectedRoute({ children, ignoreViewer }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]" role="status">
                <span  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Carregando...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role === "viewer" && !ignoreViewer) {
        return <Navigate to="/screensaver" replace />;
    }

    return children;
}