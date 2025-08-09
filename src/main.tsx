import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from "./pages/login.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import {AuthProvider} from "./api/useAuth.tsx";
import {StrictMode} from "react";
import './index.css'
import {createRoot} from "react-dom/client";
import StudentRegistration from "./pages/StudentRegister.tsx";
import StudentInfo from "./pages/Student.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={ <DashboardPage/> } />
                    <Route path="/login" element={<AuthScreen />} />
                    <Route path="/register" element={<StudentRegistration />} />
                    <Route path="/student/:studentId" element={<StudentInfo />} />
                    <Route path="*" element={<div>Page Not Found</div>} />                </Routes>
            </Router>
        </AuthProvider>
    );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
