// @ts-nocheck
import { Markup, Scenes } from "telegraf";
import { uploadFile } from "../../db";
import { Bucket } from "../../types/buckets";

export const attestScene = new Scenes.BaseScene('ATTESTA_SCENE')

// attestation flow 
// 1. ticket photo
// 1.1 save it in storage
//
// 2. fiat amount in usd
//
// 3. select chain (selector)
// 3.1 update attestation in db 
//
// 4. set recipent

attestScene.enter(async (ctx) => {
	console.log('[attest scene started]')
	ctx.session.attestationData = {
		chatId: ctx.chat?.id
	}

	await ctx.reply('Send a photo of the ticket')
	// await ctx.reply('Attestation scene started', Markup.inlineKeyboard([
	// 	Markup.button.callback('Movie button', 'MOVIE_ACTION'),
	// 	Markup.button.callback('Second button', 'SECOND_ACTION'),
	// ]))
})

attestScene.on('photo', async (ctx) => {
	try {
		await ctx.reply('Uploading photo...')

		const photo = ctx.message.photo.pop()
		const fileLink = await ctx.telegram.getFileLink(photo?.file_id)

		// download file from telegram servers
		const res = await fetch(fileLink)
		const file = await res.blob()

		// upload the file to supbase
		const fileName = `ticket-${photo?.file_unique_id}-${Date.now()}.jpeg`
		const url = await uploadFile(Bucket.Tickets, fileName, file)
		console.log(`Image uploaded: ${url}`)
		await ctx.reply('Done')

		// await ctx.reply(url)
		ctx.session.attestationData.imageUrl = url
		await ctx.reply('Now enter the fiat amount to be payed in USD')
	} catch (error) {
		await ctx.reply('Error')
		console.error(error)
		await ctx.reply(error)
	}
})

// hears for numbers
attestScene.hears(/-?\d+(\.\d+)?/, async (ctx) => {
	const amount = Number(ctx.text)

	ctx.session.attestationData.amount = amount

	// ask the user for the chain where the attestation is gonna be made
	await ctx.reply('Select a chain to create the attestation', Markup.inlineKeyboard([
		Markup.button.callback('Optimism', 'OPTIMISM_ATTESTATION'),
		Markup.button.callback('Arbitrum', 'ARBITRUM_ATTESTATION'),
	]))
})

attestScene.action('OPTIMISM_ATTESTATION', async (ctx) => {
	await ctx.reply('optmimism')
})
attestScene.action('ARBITRUM_ATTESTATION', async (ctx) => {
	await ctx.reply('arbitrum')
})

// scenarioTypeScene.enter((ctx) => {
//   ctx.session.myData = {};
//   ctx.reply('What is your drug?', Markup.inlineKeyboard([
//     Markup.callbackButton('Movie', MOVIE_ACTION),
//     Markup.callbackButton('Theater', THEATER_ACTION),
//   ]).extra());
// });
//
// scenarioTypeScene.action(THEATER_ACTION, (ctx) => {
//   ctx.reply('You choose theater');
//   ctx.session.myData.preferenceType = 'Theater';
//   return ctx.scene.enter('SOME_OTHER_SCENE_ID'); // switch to some other scene
// });
//
// scenarioTypeScene.action(MOVIE_ACTION, (ctx) => {
//   ctx.reply('You choose movie, your loss');
//   ctx.session.myData.preferenceType = 'Movie';
//   return ctx.scene.leave(); // exit global namespace
// });
//
// scenarioTypeScene.leave((ctx) => {
//   ctx.reply('Thank you for your time!');
// });
//
// // What to do if user entered a raw message or picked some other option?
// scenarioTypeScene.use((ctx) => ctx.replyWithMarkdown('Please choose either Movie or Theater'));
