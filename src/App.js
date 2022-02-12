import "./App.css";
import barbsAbi from "./BarbsCoinABI.json";
import { ethers, Contract, BigNumber } from "ethers";
import { useEffect, useState } from "react";

const exampleContractAddress = "0x9EED6d721DEB37Df2a10c3156943675ea6B42490";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [queryData, setQueryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const connectAccounts = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      setConnected(true);
    }
  };

  const query = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const networkName = await provider.getNetwork().then((res) => {
        return res.name;
      });

      // TODO: Define the variables below
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

  useEffect(() => {
    connectAccounts();
    if (connected) {
      query(accounts[0]);
    }
  }, [queryData, accounts]);

  return (
    <div className="App">
      {connected && queryData !== [] ? (
        <div className="m-10">
          {loading ? (
            <div>loading</div>
          ) : (
            <div>
              <p>thanks for connecting!</p>
              <p>block number: {queryData.blockHeight}</p>
              <p>Current ETH balance: {queryData.formattedBalance}</p>
              <p>Current BARBS balance: {queryData.formattedBarbsBalance}</p>
              <p>Current Network: {queryData.networkName}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="m-10">
          <p>please connect your wallet</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectAccounts}
          >
            Connect Metamask
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
