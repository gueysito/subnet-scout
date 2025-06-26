import 'dotenv/config';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start(ctx => ctx.reply('🤖 Welcome to Subnet Scout bot!'));
bot.hears(/ping/i, ctx => ctx.reply('pong'));
bot.on('message', ctx => ctx.reply(`You said: "${ctx.message.text}"`));

bot.launch();
console.log('✅ Telegraf bot is live');
