import { useState } from "react";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Profile from "./components/Profile";
import WalletPopup from "./components/WalletPopup";
import Candidate from "./components/candidate/CandidateMessages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "yourAlchemyApiKey" }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});

// Pass client to React Context Provider
function App() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <WagmiConfig client={client}>
        <input type="button" value="Connect" onClick={togglePopup} />
        {isOpen && (
          <WalletPopup
            content={
              <>
                <Profile />
              </>
            }
            handleClose={togglePopup}
          />
        )}
      </WagmiConfig>
      <Router>
        <Routes>
          <Route path="/candidate" element={<Candidate />} />
        </Routes>
      </Router>
      <BrowserRouter />
    </div>
  );
}

export default App;
