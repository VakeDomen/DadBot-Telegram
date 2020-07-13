 
require('dotenv').config()
const Telegram = require('telegraf');
const schedule = require('node-schedule');
const fetch = require('node-fetch');

if (!process.env.BOT_TOKEN) {
    console.log("Bot token not specified!");
    process.exit(1);
}
if (!process.env.DADJOKE_API_KEY) {
    console.log("Dadjoke API key not specified!");
    process.exit(1);
}

const bot = new Telegram(process.env.BOT_TOKEN)
const ctxts = [];


bot.start(async (ctx) => {
    ctx.reply("I will provide you with bad...i mean dad jokes");
    ctx.reply("Here is one for the taste!");
    sendAJoke(ctx);
    console.log(ctx);
    ctxts.push(ctx);
});

function scheduleJobs(ctx) {
    schedule.scheduleJob({hour: [7, 11, 15, 22]}, async function() {
        sendAJoke(ctx);
    })
}
schedule.scheduleJob({hour: [7, 11, 15, 22]}, async function() {
    sendAJokeToAllCtx();
})

async function sendAJokeToAllCtx() {
    for (const ctx of this.ctxts) {
        sendAJoke(ctx);
    }
}


async function sendAJoke(ctx) {
    const joke = await getJoke();
    ctx.reply(joke.setup);
    await delay(5000);
    ctx.reply(joke.punchline);
}

async function getJoke() {
    let resp = await fetch('https://dad-jokes.p.rapidapi.com/random/jokes', {
        method: 'GET',
        headers: { 'x-rapidapi-key': process.env.DADJOKE_API_KEY},
    }).catch(err => { console.log(err); return "Dad jokes got old..."});
    resp = await resp.json();
    return { setup: resp.setup, punchline: resp.punchline };
}

bot.launch()

function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
 }
