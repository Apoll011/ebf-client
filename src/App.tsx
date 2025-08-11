import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from "./pages/login.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import {AuthProvider} from "./hooks/useAuth.tsx";
import StudentRegistration from "./pages/StudentRegister.tsx";
import StudentInfo from "./pages/Student.tsx";
import StudentList from "./pages/StudentList.tsx";


export function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={ <DashboardPage/> } />
                    <Route path="/login" element={<AuthScreen />} />
                    <Route path="/register" element={<StudentRegistration />} />
                    <Route path="/student/:studentId" element={<StudentInfo />} />
                    <Route path="/list" element={<StudentList />} />
                    <Route path="*" element={<div>Page Not Found</div>} />                </Routes>
            </Router>
        </AuthProvider>
    );
}