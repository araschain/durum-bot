// @ts-check

const { Client, IntentsBitField, Partials } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const config = require('./config');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
    ],
    partials: [
        Partials.User,
    ],
});

const listenersPath = path.join(__dirname, './listeners');
const listenersFiles = fs.readdirSync(listenersPath).filter(file => file.endsWith('.js'));

for (const file of listenersFiles) {
    const filePath = path.join(listenersPath, file);
    /**
     * @interface @type {{ name: keyof import('discord.js').ClientEvents; once: boolean; run: (...args: any) => void | Promise<void> }}
     */
    const listener = require(filePath);

    if ('name' in listener && 'run' in listener) {
        client[ listener.once ? 'once' : 'on' ](listener.name, (...args) => { listener.run(...args); });
    }
}

client.login(config.discord.token)
    .then(() => {
        console.log('[LOGIN] Discord API\'ye istek gönderimi başarılı.');
    })
    .catch(() => {
        console.log('[LOGIN] Discord API\'ye istek gönderimi başarısız.');
    });