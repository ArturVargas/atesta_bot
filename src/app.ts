// @ts-nocheck
import 'dotenv/config';
import { Scenes, Telegraf, session } from 'telegraf'
import { attestScene } from './bot/scenes/attest';
import { setupScene } from './bot/scenes/setup';
import { testScene } from './bot/scenes/test';

// bot instance
const bot = new Telegraf(process.env.TOKEN_BOT as string);
const stage = new Scenes.Stage([attestScene, setupScene, testScene])

// bot middleware
bot.use(session())
bot.use(stage.middleware())

// start setup scene @ start
bot.start(Scenes.Stage.enter('SETUP_SCENE'))

// start with a master command /attest that triggers attest 
bot.command('attest', Scenes.Stage.enter('ATTESTA_SCENE'))

console.log('Bot running...')
bot.launch()
