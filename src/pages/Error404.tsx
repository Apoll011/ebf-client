import { useNavigate } from 'react-router-dom';
import { FlagIcon } from 'lucide-react';
import {useLocalStorageToggle} from "../hooks/useLocalStorageToggle.ts";
export function Error404() {
    const { value: glassMode  } = useLocalStorageToggle('glass')
    const navigate = useNavigate();
    return (
        <div
            className="h-screen mx-auto grid place-items-center text-center px-8 bg-[url('/wallpaper.webp')] bg-cover bg-no-repeat">
            <div>
                <FlagIcon className="w-20 h-20 mx-auto text-white"/>
                <h1 className="mt-10 text-3xl leading-snug md:text-4xl text-white">Erro 404 <br/> Página não encontrada.
                </h1>
                <button
                    onClick={() => navigate('/')}
                    className={`px-10 mt-4 cursor-pointer items-center space-x-3 py-2 rounded-md text-base font-medium transition-colors text-left text-white ${glassMode ? 'glass-button-accent' : 'bg-gray-800 hover:bg-gray-900'}`}
                >
                    <span>Página Inicial</span>
                </button>
            </div>
        </div>
    );
}