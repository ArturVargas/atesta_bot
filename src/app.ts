import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf("6380507359:AAHsExNiLLuR_Cb_4EuiFcqCm6uuxnx9idI");

import { EAS, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import 'dotenv/config';

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const schemaUID = "0x327ff96e3e610b2c0d090a3a8d2b995644461930ca1ab54431222e2fd09bbaa9";

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = new ethers.JsonRpcProvider(process.env.RPC);
console.log('-->> ', provider);
// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);
eas.connect(signer);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("string DAO_name,bytes32 ticket_ref,bool is_payed,string event_name");
const encodedData = schemaEncoder.encodeData([
	{ name: "DAO_name", value: "frutero_club", type: "string" },
	{ name: "ticket_ref", value: "0x746869732069732e20746865207469636b6574207265666572656e6365000000", type: "bytes32" },
	{ name: "is_payed", value: false, type: "bool" },
	{ name: "event_name", value: "ethcdm", type: "string" }
]);

const createAttestation = async () => {
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: BigInt(0),
      revocable: false, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  });
  const newAttestationUID = await tx.wait();
  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
}

bot.command('attest', async (ctx) => {
    // Explicit usage
    try {
      const result = await createAttestation();
      await ctx.telegram.sendMessage(ctx.message.chat.id, `Attestation created with UID: ${result}`);
    } catch (error) {
      console.log(error);
    }
    
  })
  
bot.on(message('text'), async (ctx) => {
    console.log(ctx)
// Explicit usage
await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.username}`)

// Using context shortcut
await ctx.reply(`Hello ${ctx.message.from.username}`)
})
  

bot.launch();
