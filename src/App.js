// import "./App.css";
import "./tailwind.css";
import barbsAbi from "./BarbsCoinABI.json";
import { ethers, Contract, BigNumber } from "ethers";
import { useEffect, useState } from "react";

const exampleContractAddress = "0x9EED6d721DEB37Df2a10c3156943675ea6B42490";

function App() {
  const [walletAddress, setWalletAddress] = useState([]);
  const [connected, setConnected] = useState(false);
  const [queryData, setQueryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const connectWallet = async () => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId != "0x4") {
        alert("Please connect to Rinkeby");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log(accounts);
      let wallet = accounts[0];
      setWalletAddress(wallet);
      setConnected(true);
    } else {
      alert("Please install Mask");
    }
  };

  const query = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const networkName = await provider.getNetwork().then((res) => {
        return res.name;
      });

      const chainId = (await provider.getNetwork()).chainId;
      const blockHeight = await provider.getBlockNumber();
      const gasPriceAsGwei = provider.getGasPrice().then((res) => {
        return ethers.utils.formatUnits(res, "gwei");
      });
      const blockInfo = await provider.getBlockWithTransactions(blockHeight);

      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatUnits(balance, 18).toString();

      const signer = provider.getSigner();
      const contract = new Contract(exampleContractAddress, barbsAbi.abi, signer);
      const barbsBalance = await contract.balanceOf(address);
      const formattedBarbsBalance = ethers.utils.formatUnits(barbsBalance, 18).toString();

      const data = {
        networkName,
        chainId,
        blockHeight,
        gasPriceAsGwei,
        blockInfo,
        formattedBalance,
        formattedBarbsBalance,
      };
      setQueryData(data);
      setLoading(false);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  };

  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      setConnected(true);
      setWalletAddress(accounts[0]);
    }
  };

  const sendBarbs = async () => {
    const signer = provider.getSigner();
    const contract = new Contract(exampleContractAddress, barbsAbi.abi, signer);

    contract.transfer("0xCF77D04C19155711740f4F27a1C374f1fA4071f9", "1000000000000000000").then((transferResult) => {
      console.log(transferResult);
      alert("sent token");
    });
  };

  const handleSubmit = (data) => {
    data.preventDefault();
    console.log(data);
  };

  useEffect(() => {
    isMetaMaskConnected();
    if (connected) {
      query(walletAddress);
    }
  }, [walletAddress, queryData, connected, loading]);

  return (
    <div className="flex h-screen justify-center bg-blue-100">
      {connected && queryData !== [] ? (
        <div className="m-10">
          {loading ? (
            <div>loading</div>
          ) : (
            <div className="m-10">
              <div className="bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Wallet Info</h2>
                <p className="text-lg my-1 text-gray-700">Block Number: {queryData.blockHeight}</p>
                <p className="text-lg my-1 text-gray-700">ETH balance: {queryData.formattedBalance}</p>
                <p className="text-lg my-1 text-gray-700">BARBS balance: {queryData.formattedBarbsBalance}</p>
                <p className="text-lg my-1 text-gray-700">Current Network: {queryData.networkName}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={sendBarbs}
                >
                  Send Barbs
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="m-10">
          <p>please connect your wallet</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectWallet}
          >
            Connect Metamask
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
