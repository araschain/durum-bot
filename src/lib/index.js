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
                    member.roles.remove(role, 'discord.gg/altyapilar - Raven\'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('Bir kişi aramızdan ayrıldı 😥')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• Gerekli roller, ${member.displayName}'ın/in durum mesajını **${name}** yapması nedeniyle kendisinden alındı.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı etiketi:',
                                        value: `> ${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Güncelleme saati:',
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
                                .setFooter({ text: 'Bu proje discord.gg/altyapilar sunucusundan alınmıştır.', iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/a_8830154a6bf88323c07d34907cc4caa3.gif' }),
                            ],
                          });
                        })
                        .catch(() => undefined);
                    
                    continue;
                }

                if (hasRole) continue;
                if (text !== name) continue;

                member.roles.add(role, 'discord.gg/altyapilar - Raven\'s')
                    .then(() => {
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(Colors.DarkButNotBlack)
                                .setTitle('Bir kişi daha aramıza katıldı 🎉')
                                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL() })    
                                .setDescription(`• Gerekli roller, ${member.displayName}'ın/in durum mesajını **${name}** yapması nedeniyle kendisine verildi.`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setFields([
                                    {
                                        name: 'Kullanıcı etiketi:',
                                        value: `> ${member.user.username}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Güncelleme saati:',
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
                                .setFooter({ text: 'Bu proje discord.gg/altyapilar sunucusundan alınmıştır.', iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/a_8830154a6bf88323c07d34907cc4caa3.gif' }),
                            ],
                        })
                        .catch(() => undefined);
                    })
                    .catch(() => undefined);
              
            }
        }
    },
};