const SlackBot = require('slackbots');
const request = require('superagent');
const dotenv = require('dotenv')
dotenv.config()
var Filter = require('bad-words'),
    filter = new Filter();
const weatherToken = process.env.WEATHERTOKEN
let version = 1.1
const danceLink = require('./danceLink')
scrapeIt = require("scrape-it")


const bot = new SlackBot({
    token: process.env.token,
    name: 'trevorbot'
})

bot.on('start', () => {
    console.log('start')
})

// Error Handler
bot.on('error', (err) => {
    console.log(err);
})

bot.on('message', (data) => {
    if (data.type !== 'message') {
        return;
    }
    handleMessage(data.text, data.channel);
})

function handleMessage(message, channel) {
    if (filter.isProfane(message)) {
        profanity(channel)
    } else if (message.includes(' inspire')) {
        inspireMe(channel)
    } else if (message.includes(' random joke')) {
        randomJoke(channel)
    } else if (message.includes(' run help')) {
        runHelp(channel)
    } else if (message.includes(' dance')) {
        dance(channel)
    } else if (message.includes(' rubber duck')) {
        rubberDuck(channel)
    } else if (message.includes(' hi ')) {
        hi(channel)
    } else if (message.includes(' weather')) {
        weather(channel)
    } else if (message.includes(' snowbird')) {
        snowbird(channel)
    }
}

function hi(channel) {
    const params = {
        icon_emoji: ':wave:'
    }

    bot.postMessage(
        channel,
        `Hi! My name is trevorbot (${version}), and I wil be your virtual friend, and morale buddy:shuffleparrot::reverseshuffleparrot: :shuffleparrot::reverseshuffleparrot:  Please tag me and with the message "run help" to see what I can do! :smiley:`,
        params
    )
}

function rubberDuck(channel) {
    const params = {
        icon_emoji: ':duck:'
    }

    bot.postMessage(
        channel,
        `hmmm. Thats a really tough problem.  I know you will find a brilliant solution! Sometimes when pondering such pickles I like playing pinball or going for a walk`,
        params
    )
}

function profanity(channel) {
    const params = {
        icon_emoji: ':face_with_symbols_on_mouth:'
    }
    bot.postMessage(
        channel,
        'Hey:exclamation: Lets remember our core values... Not sure that was a great example of Quality and Professionalism  Thanks:exclamation::exclamation:',
    );
}

function dance(channel) {
    const params = {
        icon_emoji: ':bananadance:'
    }
    bot.postMessage(
        channel,
        danceLink(),
        params
    );
}

async function snowbird(channel) {
    let res
    const params = {
        icon_emoji: ':aerial_tramway:'
    }
    scrapeIt("https://www.snowbird.com/mountain-report/", {
        lifts: "div.sb-clearfix.snow-report > div.dynamicCodeInsert.sortableModule.snow-report-stats.no-edit-bar > div > div:nth-child(2) > div.sb-condition_values > a > span",
        trails: " div:nth-child(4) > div.sb-condition_values > a > span",
        road: ".roads-open > div.sb-condition_values > a > span",
        twelvehrs: ".snow-report-current.no-edit-bar > div.conditions-data > div.conditions > div:nth-child(1) > div.sb-condition_values > div",
        twentyfourhrs: ".snow-report-current.no-edit-bar > div.conditions-data > div.conditions > div:nth-child(2) > div.sb-condition_values > div",
        tram: "#lifts-anchor > div > div:nth-child(1) > div:nth-child(1)",
        ytd: " div:nth-child(5) > div.sb-condition_values > div"
    }).then(({
        data,
        response
    }) => {
        res = `Snowbird currently has ${data.lifts} lifts running, and ${data.road} the road is open.  Right now ${data.trails} trails are open with ${data.twelvehrs} in the last 12 hrs, ${data.twentyfourhrs} in the last 24, and ${data.ytd} ytd. The tram is currently ${data.tram}.`
        bot.postMessage(
            channel,
            `${res}`,
            params
        )
    })
}

async function inspireMe(channel) {
    res = await request.get('https://programming-quotes-api.herokuapp.com/quotes/random')
    const quotes = res.body;
    const quote = quotes.en
    const author = quotes.author

    const params = {
        icon_emoji: ':neckbeard:'
    }

    bot.postMessage(
        channel,
        `${quote} - * ${author}*`,
        params
    );
}

async function weather(channel) {
    res = await request.get(`https://api.darksky.net/forecast/${weatherToken}`)
    const current = res.body.currently
    const temp = current.temperature
    const wind = current.windSpeed
    const precip = current.precipProbability
    const summary = current.summary

    const params = {
        icon_emoji: ':cloud:'
    }

    bot.postMessage(
        channel,
        `In Salt Lake City it is currently ${summary} and ${temp} °F, with a wind speed of ${wind} mph.  Currently we have ${precip}% chance of precipitation.`,
        params
    );
}

async function randomJoke(channel) {
    const res = await request.get('http://api.icndb.com/jokes/random?limitTo=nerdy&firstName=Scott&lastName=Beck')

    const params = {
        icon_emoji: ':rolling_on_the_floor_laughing:'
    }

    bot.postMessage(
        channel,
        `${res.body.value.joke}`,
        params
    );

}

function runHelp(channel) {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessage(
        channel,
        `Tag "@trevorbot" with "inspire" to hear one of my favorite tech quotes, "random joke" to get a hilarious Scott Beck joke, "dance" to see me bust a move, "weather" to get a current update,  "rubber duck" followed by a detailed technical question(note: Asking Trevor clear & consise questions will help you both find the best possible solution), and "run help" to get this instruction again`,
        params
    )
}