// @ts-check

const { ChannelType, ActivityType, EmbedBuilder, Colors, time } = require('discord.js');
const { presence: { name }, guild: { guildId, channelId, roleId } } = require('../config');

module.exports = {
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @returns 
     */
    async presencesUpdate(client) {
        const guild = await client.guilds.fetch({ guild: guildId, force: true });
        const channel = await guild.channels.fetch(channelId);
        const role = await guild.roles.fetch(roleId);
        let index = 0; 
        /**
         * index değişkeni düzgün çalışmayabilir.
         */
        if (
            guild && role && channel && channel.type === ChannelType.GuildText
        ) {
            const listedPresences = guild.presences.cache.filter(member => !member.user.bot);

            for (const [ memberId, presence ] of listedPresences) {     
                index++;
                
                const member = await guild.members.fetch({ user: memberId, force: true });
                if (!member || member.user.bot) continue;

                const hasRole = member.roles.cache.has(roleId);

                const [ first ] = presence?.activities || [];
                const text = first?.type === ActivityType.Custom ? first?.state : first?.name;

                if (hasRole && text !== name) {
                    member.roles.remove(role, 'discord.gg/azgin\'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('url düştü :Haram:1')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• @${member.displayName}' url düştüğü için rolü alındı.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı:',
                                        value: `> ${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'değiştirme süresi:',
                                        value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Toplam kişi:',
                                        value: `> ${index}.`,
                                        inline: true,
                                    },
                                ])
                                .setTimestamp()
                                .setFooter({ text: 'discord.gg/azgin.', iconURL: 'https://share.creavite.co/65d2297835c1ff0fa7e8314d.gif' }),
                            ],
                          });
                        })
                        .catch(() => undefined);
                    
                    continue;
                }

                if (hasRole) continue;
                if (text !== name) continue;

                member.roles.add(role, 'discord.gg/azgin \'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('url aldı :dudak: ')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• @${member.displayName} url aldığı için rolü teslim edildi.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı:',
                                        value: `>  @${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'değiştirme süresi:',
                                        value: `> ${time(parseInt(`${Date.now() / 1000}`), 'R')}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Toplam kişi:',
                                        value: `> ${index}.`,
                                        inline: true,
                                    },
                                ])
                                .setTimestamp()
                                .setFooter({ text: 'discord.gg/azgin.', iconURL: 'https://share.creavite.co/65d2297835c1ff0fa7e8314d.gif' }),
                            ],
                        })
                        .catch(() => undefined);
                    })
                    .catch(() => undefined);
              
            }
        }
    },
};