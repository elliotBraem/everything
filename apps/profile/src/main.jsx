/**
 * This is only a helper for developing this module locally
 * The module is exported from ./App
 */
import ReactDOM from "react-dom/client";
import App from "./App";
import { Social } from "@builddao/near-social-js";

const rootElement = document.getElementById("root");

const SOCIAL_CONTRACT = {
  mainnet: "social.near",
  testnet: "v1.social08.testnet",
};

const NETWORK_ID = "mainnet";

const social = new Social({
  contractId: SOCIAL_CONTRACT[NETWORK_ID],
  network: NETWORK_ID,
});

async function getProfile(username) {
  try {
    const response = await social.get({
      keys: [`${username}/profile/**`],
    });
    if (!response) {
      return null;
    }
    const { profile } = response[username];
    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

async function initializeApp() {
  try {
    const profile = await getProfile("efiz.near");
    
    if (!rootElement.innerHTML) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App profile={profile} />);
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    if (!rootElement.innerHTML) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App profile={null} />);
    }
  }
}

initializeApp();
