// @ts-nocheck

import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the context
type Web3ContextType = {
  connection: string | null;
  setConnection: React.Dispatch<React.SetStateAction<string | null>>;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Define the provider
export const Web3Provider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<string | null>(null);

  return (
    <Web3Context.Provider value={{ connection, setConnection }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
