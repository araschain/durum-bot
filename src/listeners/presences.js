// @ts-check
const { presencesUpdate } = require('../lib');

module.exports = {    
    name: 'ready',
    once: false,
    /** @param {import('discord.js').Client} client */
    run: async (client) => {
        setInterval(() => presencesUpdate(client), 5000);
    },
};
