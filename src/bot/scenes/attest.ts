// @ts-nocheck
import { Markup, Scenes } from "telegraf";

export const attestScene = new Scenes.BaseScene('ATTESTA_SCENE')

// attestation flow 
// 1. ticket photo
// 1.1 save it in storage
// 1.2 create new attestation record in db
//
// 2. fiat amount in usd
// 2.1 update attestation in db 
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

	await ctx.reply('Attestation scene started', Markup.inlineKeyboard([
		Markup.button.callback('Movie button', 'MOVIE_ACTION'),
		Markup.button.callback('Second button', 'SECOND_ACTION'),
	]))

})

attestScene.action('MOVIE_ACTION', async (ctx) => {
	await ctx.reply('Movie triggered')
})

attestScene.action('SECOND_ACTION', async (ctx) => {
	await ctx.reply('Second button triggered')
	// ctx.scene.enter('SETUP_SCENE')
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
