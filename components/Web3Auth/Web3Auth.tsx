"use client";

import { useEffect, useState } from "react";
import { Button } from "../common";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { Avatar, AuthContainer } from "./Web3Auth.styled";
import { useWeb3 } from "./Web3Context";

const getConnectedAccounts = async () => {
  if (!window.ethereum) return [];
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts;
};

export default function Web3Auth() {
  let {connection, setConnection} = useWeb3();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const initializeProvider = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: any) => {
      // Handle the accounts changing (e.g., when a user disconnects their wallet)
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
        setConnection(null);
        setProvider(null);
      } else {
        setConnection(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the network chain changes (for safety)
      window.location.reload();
    };

    getConnectedAccounts().then((accounts) => {
      if (Array(accounts).length > 0) {
        setConnection(Array(accounts)[0]); // Set the first account as the connected account
      }
    });

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      // Remove event listeners when the component unmounts
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <>
      {connection === null && (
        <Button onClick={() => initializeProvider()}>Connect Wallet</Button>
      )}
      {connection !== null && (
        <AuthContainer>
          <Avatar
            src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${connection}`}
          />
          <p>
            {String(connection).slice(0, 6) +
              `...` +
              String(connection).slice(-4)}
          </p>
        </AuthContainer>
      )}
    </>
  );
}
