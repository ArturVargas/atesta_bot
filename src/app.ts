import 'dotenv/config';

// todo: move to bot/
import { Telegraf } from 'telegraf'
const bot = new Telegraf(process.env.TOKEN_BOT as string);

// todo: move somewhere else, maybe to something like ethers/ or wallet/
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider(process.env.RPC);
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

// todo: attach commands and scenes to the bot 

bot.launch();
