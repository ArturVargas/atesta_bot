import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC);
export const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);
