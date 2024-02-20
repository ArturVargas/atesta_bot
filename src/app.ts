import 'dotenv/config';
import { Telegraf, session } from 'telegraf'
import { Stage } from 'telegraf/typings/scenes';
import { attestScene } from './bot/scenes/attest';

// bot instance
const bot = new Telegraf(process.env.TOKEN_BOT as string);
// @ts-ignore - context related issue(?)
const stage = new Stage([attestScene])

// bot middleware
bot.use(session())
// @ts-ignore - context related issue(?)
bot.use(stage.middleware())

// start with a master command /attest that triggers attest 
// scene
// @ts-ignore - context related issue(?)
bot.command('/attest', Stage.enter('ATTEST_SCENE'))

bot.launch();
