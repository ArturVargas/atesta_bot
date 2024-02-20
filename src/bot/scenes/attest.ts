import { Scenes } from "telegraf";

export const attestScene = new Scenes.BaseScene('ATTESTA_SCENE')

attestScene.enter((ctx) => {
	ctx.reply('mesta [sent from attesta scene]')
})

// attestScene.enter((ctx) => {
// 	// todo: define
// })

// todo: add some actions 
// 1. ask for the dao name
// 2. ticket ref? 
// 3. event name 
// 4. payed

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
