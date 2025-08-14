import Header from "../components/Header.tsx";
import React from "react";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {useLocalStorageToggle} from "../hooks/useLocalStorageToggle.ts";
import {useRenderTrigger} from "../hooks/useRenderTrigger.tsx";

export const MainLayout = ({children}: {children: React.ReactNode}) => {
    const { value: glassMode  } = useLocalStorageToggle('glass')
    const { trigger } = useRenderTrigger();

    return (
      <ProtectedRoute>
          <div className={`flex flex-col min-h-screen bg-gray-100 ${glassMode ? 'bg-[url(\'/wallpaper.webp\')] bg-cover bg-no-repeat bg-fixed' : ''}`}>
              <Header key={trigger} />
                  <div className={`min-h-screen mb-4 ${glassMode ? 'mt-4' : 'mt-0'}`}>
                  {children}
              </div>
              <footer className={`${glassMode ? 'glass-card mx-5 mb-2 top-5 text-white' :'w-full bg-white'} flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-gray p-6 shadow-sm border-t border-gray-500 text-center md:justify-between`}>
                  <p className="font-normal text-blue-gray-500 text-sm">
                      &copy; 2025 <strong>@Embrace</strong> by Tiago Inês &nbsp;|&nbsp; <em>1 Coríntios 10:31</em> — Portanto, quer comais, quer bebais, ou façais qualquer outra coisa, fazei tudo para a glória de Deus.
                  </p>
              </footer>
          </div>
      </ProtectedRoute>
    );
};