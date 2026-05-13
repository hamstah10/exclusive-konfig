import { createContext, useContext, useState, ReactNode } from "react";

interface FunnelProgress {
  current: number;
  total: number;
}

interface FunnelProgressContextValue {
  progress: FunnelProgress | null;
  setProgress: (p: FunnelProgress | null) => void;
}

const FunnelProgressContext = createContext<FunnelProgressContextValue | undefined>(undefined);

export const FunnelProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<FunnelProgress | null>(null);
  return (
    <FunnelProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </FunnelProgressContext.Provider>
  );
};

export const useFunnelProgress = () => {
  const ctx = useContext(FunnelProgressContext);
  if (!ctx) throw new Error("useFunnelProgress must be used within FunnelProgressProvider");
  return ctx;
};
