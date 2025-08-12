import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AuthScreen from "./pages/login.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import {AuthProvider} from "./hooks/useAuth.tsx";
import StudentRegistration from "./pages/StudentRegister.tsx";
import StudentInfo from "./pages/Student.tsx";
import StudentList from "./pages/StudentList.tsx";
import {FlagIcon} from "lucide-react";

function Error404() {
    const navigate = useNavigate();
    return (
        <div className="h-screen mx-auto grid place-items-center text-center px-8 bg-[url('/wallpaper.webp')] bg-cover bg-no-repeat">
            <div>
                <FlagIcon className="w-20 h-20 mx-auto text-white" />
                <h1 className="mt-10 text-3xl leading-snug md:text-4xl text-white">Erro 404 <br /> Página não encontrada.</h1>
                <button
                    onClick={() => navigate('/')}
                    className={`px-10 mt-4 cursor-pointer items-center space-x-3 py-2 rounded-md text-base font-medium transition-colors text-left text-white bg-gray-800 hover:bg-gray-900`}
                >
                    <span>Página Inicial</span>
                </button>
            </div>
        </div>
    );
}

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
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}