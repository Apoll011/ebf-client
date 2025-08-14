import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface RenderTriggerContextType {
  trigger: number;
  rerender: () => void;
}

const RenderTriggerContext = createContext<RenderTriggerContextType | undefined>(
  undefined
);

interface RenderTriggerProviderProps {
  children: ReactNode;
}

export function RenderTriggerProvider({ children }: RenderTriggerProviderProps) {
  const [trigger, setTrigger] = useState<number>(0);

  const rerender = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return (
    <RenderTriggerContext.Provider value={{ trigger, rerender }}>
      {children}
    </RenderTriggerContext.Provider>
  );
}

export function useRenderTrigger(): RenderTriggerContextType {
  const context = useContext(RenderTriggerContext);
  if (!context) {
    throw new Error("useRenderTrigger must be used within a RenderTriggerProvider");
  }
  return context;
}
