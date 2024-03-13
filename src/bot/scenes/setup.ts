// @ts-nocheck
import { Scenes } from "telegraf";
import { supabase } from "../../db";

// Require a wallet 
// Require the user's name
export const setupScene = new Scenes.WizardScene(
	'SETUP_SCENE',
	async (ctx) => {
		console.log(`[setup scene started for chat ${ctx.chat?.id}]`)
		await ctx.reply('Welcome to atesta_bot, a bot for creating attestations of expenses\' tickets for DAOs and similar entities.')
		await ctx.reply('Before we start, we need some information to get you started...')
		await ctx.reply('What is your name?');
		ctx.wizard.state.userData = {
			chatId: ctx.chat?.id
		};
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (ctx.message.text.length < 2) {
			await ctx.reply('Please enter a valid name');
			return;
		}
		ctx.wizard.state.userData.name = ctx.message.text;
		await ctx.reply(`Great! now enter an evm address associated with your attestations`);
		await ctx.reply('Notice that this will be the address to which entities will be sending the corresponding payments')
		return ctx.wizard.next();
	},
	async (ctx) => {
		// todo: validate address
		ctx.wizard.state.userData.address = ctx.message.text;

		await ctx.reply('Saving your profile...')
		const { error } = await supabase
			.from('attesters')
			.insert(ctx.wizard.state.userData)

		if (error) {
			console.error(error)
			await ctx.reply('Something went wrong creating the user:')
			await ctx.reply(error.message)
			return
		}

		await ctx.reply('That\'s it! you are all set')
		await ctx.reply('Try calling the /attest command to create your first attestation')

		console.log('New user created')
		console.log(JSON.stringify(ctx.wizard.state.userData))

		return ctx.scene.leave();
	},
);

