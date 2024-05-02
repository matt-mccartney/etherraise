"use client";

import { useEffect, useState } from "react";
import { Button } from "../common";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { Avatar, AuthContainer } from "./Web3Auth.styled";
import { useWeb3 } from "./Web3Context";
import Web3Menu from "./Web3Menu";

const getConnectedAccounts = async () => {
  if (!window.ethereum) return [];
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts;
};

export default function Web3Auth() {
  let { connection, setConnection } = useWeb3();
  let [connectionName, setConnectionName] = useState<String | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const initializeProvider = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  };

  const getConnectionName = async () => {
    if (!window.ethereum || connection == null || connection == "") return;
    const provider = new ethers.BrowserProvider(window.ethereum)
    let names;
    try {
      names = await provider.lookupAddress(connection)
    } catch (err) {
      names = null;
    }
    return ((names !== null && names?.length > 0) ? names :
      String(connection).slice(0, 6) + `...` + String(connection).slice(-4)
    );
  };

  useEffect(() => {
    const fetchConnectionName = async () => {
      const name = await getConnectionName();
      setConnectionName(name !== undefined ? name : null);
    };

    fetchConnectionName();
  }, [connection]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: any) => {
      // Handle the accounts changing (e.g., when a user disconnects their wallet)
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
        setConnection(null);
        setProvider(null);
      } else {
        setConnection(
          Array(accounts).length > 0 ? String(Array(accounts)[0]) : null
        );
        initializeProvider();
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the network chain changes (for safety)
      window.location.reload();
    };

    getConnectedAccounts().then((accounts) => {
      if (Array(accounts).length > 0) {
        setConnection(
          Array(accounts).length > 0 ? String(Array(accounts)[0]) : null
        ); // Set the first account as the connected account
        initializeProvider();
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
      {connection === "" && (
        <Button onClick={() => initializeProvider()}>Connect Wallet</Button>
      )}
      {connection !== "" && (
        <Web3Menu>
          <Avatar
            src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${connection}`}
          />
          <p className="mt-1">{connectionName}</p>
        </Web3Menu>
      )}
    </>
  );
}
