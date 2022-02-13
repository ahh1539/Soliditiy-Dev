import "./tailwind.css";
import barbsAbi from "./BarbsCoinABI.json";
import { ethers, Contract, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const exampleContractAddress = "0x9EED6d721DEB37Df2a10c3156943675ea6B42490";

function App() {
  const [walletAddress, setWalletAddress] = useState([]);
  const [connected, setConnected] = useState(false);
  const [queryData, setQueryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const connectWallet = async () => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x4") {
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

  const sendBarbs = async (toAddress, amount) => {
    const unformattedAmount = ethers.utils.parseEther(amount);
    amount = unformattedAmount.toString();
    const signer = provider.getSigner();
    const contract = new Contract(exampleContractAddress, barbsAbi.abi, signer);

    contract.transfer(toAddress, amount).then(
      (transferResult) => {
        alert("BARBS sent! transaction: " + transferResult.hash);
        console.log(transferResult);
        reset();
      },
      (onRejected) => {
        alert(onRejected.message);
      }
    );
  };

  const onSubmit = async (data) => {
    sendBarbs(data.toAddress, data.amount);
  };

  useEffect(() => {
    isMetaMaskConnected();
    if (connected) {
      query(walletAddress);
    }
  }, [walletAddress, queryData, connected, loading]);

  return (
    <div className="h-screen bg-blue-100">
      <nav className="flex items-center justify-between flex-wrap bg-blue-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
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
            <a
              href="#responsive-header"
              className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4"
            >
              Coin
            </a>
            <a
              href="#responsive-header"
              className="text-lg block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4"
            >
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
      <div className="flex justify-center">
        <div className="m-10">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            {connected && queryData !== [] ? (
              <div>
                {loading ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Loading...</h2>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Wallet Info</h2>
                    <p className="text-lg my-1 text-gray-700">Block Number: {queryData.blockHeight}</p>
                    <p className="text-lg my-1 text-gray-700">ETH balance: {queryData.formattedBalance}</p>
                    <p className="text-lg my-1 text-gray-700">BARBS balance: {queryData.formattedBarbsBalance}</p>
                    <p className="text-lg my-1 text-gray-700">Current Network: {queryData.networkName}</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="my-3">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Send Address</label>
                        <input
                          {...register("toAddress", { required: true, pattern: /^0x[a-fA-F0-9]{40}$/ })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Address"
                        />
                        {errors?.toAddress?.type === "pattern" && <p>Not a valid ethereum address</p>}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount in BARBS</label>
                        <input
                          {...register("amount", { required: true })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="submit"
                        >
                          Send Barbs
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid place-items-center">
                <h2 className="text-2xl font-bold m-4 text-gray-800">Please connect your wallet</h2>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={connectWallet}
                >
                  Connect Metamask
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
