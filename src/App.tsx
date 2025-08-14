import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthScreen from "./pages/AuthScreen.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import {AuthProvider} from "./hooks/useAuth.tsx";
import StudentRegistration from "./pages/StudentRegister.tsx";
import StudentInfo from "./pages/Student.tsx";
import StudentList from "./pages/StudentList.tsx";
import Screensaver from "./pages/ScreenSaver.tsx";
import {Error404} from "./pages/Error404.tsx";
import {RenderTriggerProvider} from "./hooks/useRenderTrigger.tsx";

export function App() {
    return (
        <RenderTriggerProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={ <DashboardPage/> } />
                        <Route path="/login" element={<AuthScreen />} />
                        <Route path="/register" element={<StudentRegistration />} />
                        <Route path="/student/:studentId" element={<StudentInfo />} />
                        <Route path="/list" element={<StudentList />} />
                        <Route path="/screensaver" element={<Screensaver />} />
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </RenderTriggerProvider>
    );
}