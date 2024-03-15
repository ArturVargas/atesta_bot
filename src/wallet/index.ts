import { ethers } from "ethers";
import { Chains } from "./chains";

const privateKey = process.env.WALLET_PRIVATE_KEY as string

// const provider = new ethers.JsonRpcProvider(process.env.RPC);
// export const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

export const getSignerFor = (chain: Chains) => {
	const provider = new ethers.JsonRpcProvider(chain)
	const signer = new ethers.Wallet(privateKey, provider)
	return signer
}
