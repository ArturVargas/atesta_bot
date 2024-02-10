import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { getInfoImage } from "./openAiService";

const bot = new Telegraf(process.env.TOKEN_BOT as string);

import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import "dotenv/config";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const schemaUID =
  "0x6c7a6811478fe246273195b938667d8229f0f91def70af3121040f4537649ff0";
const chatImageInfo = new Map<number, string>();
// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = new ethers.JsonRpcProvider(process.env.RPC);
console.log("-->> ", provider);
// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
const signer = new ethers.Wallet(
  process.env.WALLET_PRIVATE_KEY as string,
  provider
);
eas.connect(signer);

/////////
///EAS FUNCTIONS
/////////

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder(
  "string DAO_name,bytes32 ticket_ref,bool is_payed,string event_name,string image_info"
);

const createAttestation = async (encodedData: any) => {
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0x6D082B729Fa74206DD5454148616C278515De955",
      expirationTime: BigInt(0),
      revocable: false, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  });
  const newAttestationUID = await tx.wait();
  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
};

///////
//TELEGRAM BOT FUNCTIONS
//////
bot.command("attest", async (ctx) => {
  // Explicit usage
  try {
    const imageInfo = chatImageInfo.get(ctx.message.chat.id);

    if (!imageInfo) {
      await ctx.reply("You need to send an image first");
      return;
    }

    const encodedData = schemaEncoder.encodeData([
      { name: "DAO_name", value: "frutero_club", type: "string" },
      {
        name: "ticket_ref",
        value:
          "0x746869732069732e20746865207469636b6574207265666572656e6365000000",
        type: "bytes32",
      },
      { name: "is_payed", value: false, type: "bool" },
      { name: "event_name", value: "ethcdm", type: "string" },
      { name: "image_info", value: imageInfo, type: "string" },
    ]);

    const result = await createAttestation(encodedData);
    await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Attestation created with UID: ${result}`
    );
    chatImageInfo.delete(ctx.message.chat.id);
  } catch (error) {
    console.log(error);
  }
});
bot.on(message("text"), async (ctx) => {
  console.log(ctx);
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.username}`
  );

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.message.from.username}`);
});

bot.on("photo", async (ctx) => {
  try {
    const photo = ctx.message.photo.pop();
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    const imageInfo = await getInfoImage(fileLink.toString());
    console.log(imageInfo);

    if (imageInfo !== null) {
      chatImageInfo.set(ctx.message.chat.id, imageInfo);
      await ctx.reply(
        "Imagen recibida, usa el comando /attest para crear una atestación"
      );
    } else {
      await ctx.reply("No se pudo obtener la información de la imagen.");
    }
  } catch (error) {
    console.error(error);
    await ctx.reply(
      "there is something wrong with the image, try again later."
    );
  }
});

bot.launch();
