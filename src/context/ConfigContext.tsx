import { createContext, useContext, ReactNode } from 'react';
import { PresentationConfig } from '../types/presentation.types';

interface ConfigContextType {
  config: PresentationConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  config: PresentationConfig;
  children: ReactNode;
}

export function ConfigProvider({ config, children }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
