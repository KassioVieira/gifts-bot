require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const botHandler = require('./src/bot');
const newListHandler = require('./src/newList');
const listHandler = require('./src/list');
const addGiftHandler = require('./src/addGift');

const token = process.env.TELEGRAM_BOT_TOKEN;

const telegramBot = new TelegramBot(token, { polling: true });

botHandler(telegramBot);
newListHandler(telegramBot);
listHandler(telegramBot);
addGiftHandler(telegramBot);