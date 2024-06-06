import React from "react";
import { useWallet } from "./WalletContext";
import connectIcon from "assets/images/icons/connect.png";

// Define the types for the wallet context
interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

interface Wallet {
  label: string;
  accounts: { address: string }[];
}

const ConnectWallet = () => {
  const { wallet, connectWallet, disconnectWallet } =
    useWallet() as WalletContextType;

  return (
    <div>
      {wallet ? (
        <button onClick={disconnectWallet}>Disconnect</button>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  );
};

export default ConnectWallet;
