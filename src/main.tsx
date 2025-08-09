import {StrictMode, useEffect, useState} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {useAuth} from "./api/useAuth.ts";

function App() {
    const {api , login, logout, isAuthenticated, user} = useAuth();
    const [num, setNum] = useState(0);

    login('apoll011', 'jesus').then(r => (
        console.log('Login result:', r)
    ));

    useEffect(() => {
        if(isAuthenticated) {
            api.getTodaySummary().then(r => {
                console.log('Today summary:', r);
            })
        }
    }, [isAuthenticated]);

    return (
        <div>
            <h1>Hello, World!</h1>
        </div>
    )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
