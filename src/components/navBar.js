import React from "react";
import "../tailwind.css";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

function NavBar() {
  const [walletAddress, setWalletAddress] = useState([]);
  const [connected, setConnected] = useState(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const connectWallet = async () => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log(accounts);
      let wallet = accounts[0];
      setWalletAddress(wallet);
      setConnected(true);
    } else {
      alert("Please install Mask");
    }
  };

  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      setConnected(true);
      setWalletAddress(accounts[0]);
      return;
    }
    setConnected(false);
  };

  useEffect(() => {
    isMetaMaskConnected();
    setInterval(() => {
      isMetaMaskConnected();
    }, 5000);
  }, [walletAddress, connected]);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-blue-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54">
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-2xl tracking-tight">Barbs Network</span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <a href="/" className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4">
            Coin
          </a>
          <a href="/ico" className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4">
            ICO
          </a>
          <a
            href="#responsive-header"
            className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4"
          >
            Marketplace
          </a>
          <a
            href="#responsive-header"
            className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black"
          >
            About
          </a>
        </div>
        <div>
          {!connected && (
            <button
              className="bg-transparent text-white hover:text-black hover:bg-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded"
              onClick={connectWallet}
            >
              Connect Metamask
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
