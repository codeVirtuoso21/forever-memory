import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import onboard from "./web3-onboard";

interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

interface Wallet {
  label: string;
  accounts: { address: string }[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    const storedWalletLabel = localStorage.getItem("connectedWallet");
    console.log("Stored Wallet Label:", storedWalletLabel); // Debugging
    if (storedWalletLabel) {
      onboard
        .connectWallet({
          autoSelect: { label: storedWalletLabel, disableModals: true },
        })
        .then((wallets: Wallet[]) => {
          if (wallets.length > 0) {
            setWallet(wallets[0]);
            // const fetchData = async () => {
            //   const address = wallets[0].accounts[0].address;
            //   try {
            //     const response = await fetch(
            //       "http://localhost:4000/api/user/signUp",
            //       {
            //         method: "POST",
            //         headers: {
            //           "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({ address }),
            //       }
            //     );

            //     if (response.ok) {
            //       const data = await response.json();
            //       console.log(data);
            //     } else {
            //       console.error("Failed to fetch data:", response.statusText);
            //     }
            //   } catch (error) {
            //     console.error("Error:", error);
            //   }
            // };

            // fetchData();
          } else {
            localStorage.removeItem("connectedWallet");
            localStorage.removeItem("address");
          }
        })
        .catch((error: any) => {
          console.error("Error connecting wallet:", error);
          localStorage.removeItem("connectedWallet");
          localStorage.removeItem("address");
        });
    }
  }, []);

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      if (wallets.length > 0) {
        const connectedWallet = wallets[0];
        setWallet(connectedWallet);
        localStorage.setItem("connectedWallet", connectedWallet.label);
        localStorage.setItem("address", connectedWallet.accounts[0].address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet && wallet.label) {
        console.log(
          "Attempting to disconnect wallet with label:",
          wallet.label
        );
        const response = await onboard.disconnectWallet({
          label: wallet.label,
        });
        console.log("Response from disconnect:", response);
      }
      setWallet(null);
      localStorage.removeItem("connectedWallet");
      localStorage.removeItem("address");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
