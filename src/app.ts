import 'dotenv/config';
import { Scenes, Telegraf, session } from 'telegraf'
import { attestScene } from './bot/scenes/attest';
import { Attester } from './eas';

// bot instance
const bot = new Telegraf(process.env.TOKEN_BOT as string);
// @ts-ignore - weird context related error
const stage = new Scenes.Stage([attestScene])

// bot middleware
bot.use(session())
// @ts-ignore - weird context related error
bot.use(stage.middleware())

// start with a master command /attest that triggers attest 
// scene
// @ts-ignore - weird context related error
bot.command('attest', Scenes.Stage.enter('ATTESTA_SCENE'))

console.log('Bot running...')
bot.launch()
