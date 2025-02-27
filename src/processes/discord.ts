import discord, { TextChannel, Client, Message } from "discord.js";
import { DeleteWriteOpResultObject } from "mongodb";
import { Express } from "express";

import { GuildConfig } from "../models/guild-config";
import { Game } from "../models/game";
import config from "../models/config";

let client: Client;
type DiscordProcessesOptions = {
  app: Express
}

const discordProcesses = (options: DiscordProcessesOptions, readyCallback: () => {}) => {
  client = new discord.Client();
  const app = options.app;

  /**
   * Discord.JS - ready
   */
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}!`);
    readyCallback();
  });

  /**
   * Discord.JS - message
   */
  client.on("message", async message => {
    try {
      if (message.content.startsWith(process.env.BOTCOMMAND_SCHEDULE) && message.channel instanceof TextChannel) {
        const parts = message.content
          .trim()
          .split(" ")
          .filter(part => part.length > 0)
          .slice(1);
        const cmd = parts.reverse().pop();
        parts.reverse();

        const guild = message.channel.guild;
        const guildId = guild.id;
        const guildConfig = await GuildConfig.fetch(guildId);

        const languages = app.locals.langs;
        const lang = languages.find(l => l.code === guildConfig.lang) || languages.find(l => l.code === "en");

        if (!message.channel.guild) {
          message.reply(lang.config.desc.SERVER_COMMAND);
          return;
        }

        const member = message.channel.guild.members.array().find(m => m.user.id === message.author.id);
        const canConfigure = member ? member.hasPermission(discord.Permissions.FLAGS.MANAGE_GUILD) : false;

        if (cmd === "help" || message.content.trim().split(" ").length === 1) {
          let embed = new discord.RichEmbed()
            .setTitle("RPG Schedule Help")
            .setColor(guildConfig.embedColor)
            .setDescription(
              `__**${lang.config.COMMAND_LIST}**__\n` +
                `\`${process.env.BOTCOMMAND_SCHEDULE}\` - ${lang.config.desc.HELP}\n` +
                `\`${process.env.BOTCOMMAND_SCHEDULE} help\` - ${lang.config.desc.HELP}\n` +
                (canConfigure ? `\n${lang.config.CONFIGURATION}\n` +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} configuration\` - ${lang.config.desc.CONFIGURATION}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} add-channel #channel-name\` - ${lang.config.desc.ADD_CHANNEL}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} remove-channel #channel-name\` - ${lang.config.desc.REMOVE_CHANNEL}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} pruning ${guildConfig.pruning ? "on" : "off"}\` - \`on/off\` - ${lang.config.desc.PRUNING}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} embeds ${guildConfig.embeds || guildConfig.embeds == null ? "on" : "off"}\` - \`on/off\` - ${lang.config.desc.EMBEDS}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} embed-color ${guildConfig.embedColor}\` - ${lang.config.desc.EMBED_COLOR}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} emoji-sign-up ${guildConfig.emojiAdd}\` - ${lang.config.desc.EMOJI}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} emoji-drop-out ${guildConfig.emojiRemove}\` - ${lang.config.desc.EMOJI}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} private-reminders\` - ${lang.config.desc.PRIVATE_REMINDERS.replace(/\:PR/gi, guildConfig.privateReminders ? "on" : "off")}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} role role name\` - ${lang.config.desc.ROLE}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} manager-role role name\` - ${lang.config.desc.MANAGER_ROLE}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} password somepassword\` - ${lang.config.desc.PASSWORD_SET}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} password\` - ${lang.config.desc.PASSWORD_CLEAR}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} toggle-drop-out\` - ${lang.config.desc.TOGGLE_DROP_OUT}\n` : ``) +
                    (canConfigure ? `\`${process.env.BOTCOMMAND_SCHEDULE} lang ${guildConfig.lang}\` - ${lang.config.desc.LANG} ${languages.map(l => `\`${l.code}\` (${l.name})`).join(", ")}\n` : ``)
                  : ``) +
                `\n${lang.config.USAGE}\n` +
                `\`${process.env.BOTCOMMAND_SCHEDULE} link\` - ${lang.config.desc.LINK}`
            );
          message.channel.send(embed);
        } else if (cmd === "link") {
          message.channel.send(
            process.env.HOST + `/lang/${guildConfig.lang}?returnTo=${escape(process.env.HOST + config.urls.game.create.path + "?s=" + guildId)}`
          );
        } else if (cmd === "configuration") {
          if (canConfigure) {
            const channel = guildConfig.channels.map(c => {
              return guild.channels.get(c);
            }) || [guild.channels.array().find(c => c instanceof TextChannel)];

            let embed = new discord.RichEmbed()
              .setTitle(`RPG Schedule ${lang.config.CONFIGURATION}`)
              .setColor(guildConfig.embedColor)
              .setDescription(
                `${lang.config.GUILD}: \`${guild.name}\`\n` +
                `${lang.config.CHANNELS}: \`${channel.filter(c => c).map(c => c.name).join(" | ")}\`\n` +
                `${lang.config.PRUNING}: \`${guildConfig.pruning ? "on" : "off"}\`\n` +
                `${lang.config.EMBEDS}: \`${!(guildConfig.embeds === false) ? "on" : "off"}\`\n` +
                `${lang.config.EMBED_COLOR}: \`${guildConfig.embedColor}\`\n` +
                `${lang.config.EMOJI_JOIN}: \`${guildConfig.emojiAdd}\`\n` +
                `${lang.config.EMOJI_LEAVE}: \`${guildConfig.emojiRemove}\`\n` +
                `${lang.config.PRIVATE_REMINDERS}: \`${guildConfig.privateReminders ? "on" : "off"}\`\n` +
                `${lang.config.PASSWORD}: ${guildConfig.password ? `\`${guildConfig.password}\`` : "Disabled"}\n` +
                `${lang.config.ROLE}: ${guildConfig.role ? `\`${guildConfig.role}\`` : "All Roles"}\n` +
                `${lang.config.MANAGER_ROLE}: ${guildConfig.managerRole ? `\`${guildConfig.managerRole}\` and Server Admins` : "Server Admins"}\n` +
                `${lang.config.DROP_OUTS}: ${guildConfig.dropOut ? `Enabled` : "Disabled"}\n` +
                `${lang.config.LANGUAGE}: ${guildConfig.lang}\n`
              );
            message.author.send(embed);
          }
        } else if (cmd === "add-channel") {
          if (canConfigure) {
            const channel: string = parts[0].replace(/\<\#|\>/g, "");
            const channels = guildConfig.channels;
            channels.push(channel);
            guildConfig
              .save({
                channel: channels
              })
              .then(result => {
                message.channel.send(`${lang.config.CHANNEL_ADDED}`);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "remove-channel") {
          if (canConfigure) {
            const channel: string = parts[0].replace(/\<\#|\>/g, "");
            const channels = guildConfig.channels;
            if (channels.indexOf(channel) >= 0) {
              channels.splice(channels.indexOf(channel), 1);
            }
            guildConfig
              .save({
                channel: channels
              })
              .then(result => {
                message.channel.send(`${lang.config.CHANNEL_REMOVED}`);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "pruning") {
          if (canConfigure) {
            guildConfig
              .save({
                pruning: parts[0] === "on"
              })
              .then(result => {
                message.channel.send(parts[0] === "on" ? lang.config.PRUNING_ON : lang.config.PRUNING_OFF);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "embeds") {
          if (canConfigure) {
            guildConfig
              .save({
                embeds: !(parts[0] === "off")
              })
              .then(result => {
                message.channel.send(!(parts[0] === "off") ? lang.config.EMBEDS_ON : lang.config.EMBEDS_OFF);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "embed-color") {
          if (canConfigure) {
            let color = parts.join("");
            var colors = {
              aliceblue: "#f0f8ff",
              antiquewhite: "#faebd7",
              aqua: "#00ffff",
              aquamarine: "#7fffd4",
              azure: "#f0ffff",
              beige: "#f5f5dc",
              bisque: "#ffe4c4",
              black: "#000000",
              blanchedalmond: "#ffebcd",
              blue: "#0000ff",
              blueviolet: "#8a2be2",
              brown: "#a52a2a",
              burlywood: "#deb887",
              cadetblue: "#5f9ea0",
              chartreuse: "#7fff00",
              chocolate: "#d2691e",
              coral: "#ff7f50",
              cornflowerblue: "#6495ed",
              cornsilk: "#fff8dc",
              crimson: "#dc143c",
              cyan: "#00ffff",
              darkblue: "#00008b",
              darkcyan: "#008b8b",
              darkgoldenrod: "#b8860b",
              darkgray: "#a9a9a9",
              darkgreen: "#006400",
              darkkhaki: "#bdb76b",
              darkmagenta: "#8b008b",
              darkolivegreen: "#556b2f",
              darkorange: "#ff8c00",
              darkorchid: "#9932cc",
              darkred: "#8b0000",
              darksalmon: "#e9967a",
              darkseagreen: "#8fbc8f",
              darkslateblue: "#483d8b",
              darkslategray: "#2f4f4f",
              darkturquoise: "#00ced1",
              darkviolet: "#9400d3",
              deeppink: "#ff1493",
              deepskyblue: "#00bfff",
              dimgray: "#696969",
              dodgerblue: "#1e90ff",
              firebrick: "#b22222",
              floralwhite: "#fffaf0",
              forestgreen: "#228b22",
              fuchsia: "#ff00ff",
              gainsboro: "#dcdcdc",
              ghostwhite: "#f8f8ff",
              gold: "#ffd700",
              goldenrod: "#daa520",
              gray: "#808080",
              green: "#008000",
              greenyellow: "#adff2f",
              honeydew: "#f0fff0",
              hotpink: "#ff69b4",
              indianred: "#cd5c5c",
              indigo: "#4b0082",
              ivory: "#fffff0",
              khaki: "#f0e68c",
              lightyellow: "#ffffe0",
              lime: "#00ff00",
              limegreen: "#32cd32",
              linen: "#faf0e6",
              lavender: "#e6e6fa",
              lavenderblush: "#fff0f5",
              lawngreen: "#7cfc00",
              lemonchiffon: "#fffacd",
              lightblue: "#add8e6",
              lightcoral: "#f08080",
              lightcyan: "#e0ffff",
              lightgoldenrodyellow: "#fafad2",
              lightgrey: "#d3d3d3",
              lightgreen: "#90ee90",
              lightpink: "#ffb6c1",
              lightsalmon: "#ffa07a",
              lightseagreen: "#20b2aa",
              lightskyblue: "#87cefa",
              lightslategray: "#778899",
              lightsteelblue: "#b0c4de",
              magenta: "#ff00ff",
              maroon: "#800000",
              mediumaquamarine: "#66cdaa",
              mediumblue: "#0000cd",
              mediumorchid: "#ba55d3",
              mediumpurple: "#9370d8",
              mediumseagreen: "#3cb371",
              mediumslateblue: "#7b68ee",
              mediumspringgreen: "#00fa9a",
              mediumturquoise: "#48d1cc",
              mediumvioletred: "#c71585",
              midnightblue: "#191970",
              mintcream: "#f5fffa",
              mistyrose: "#ffe4e1",
              moccasin: "#ffe4b5",
              navajowhite: "#ffdead",
              navy: "#000080",
              oldlace: "#fdf5e6",
              olive: "#808000",
              olivedrab: "#6b8e23",
              orange: "#ffa500",
              orangered: "#ff4500",
              orchid: "#da70d6",
              palegoldenrod: "#eee8aa",
              palegreen: "#98fb98",
              paleturquoise: "#afeeee",
              palevioletred: "#d87093",
              papayawhip: "#ffefd5",
              peachpuff: "#ffdab9",
              peru: "#cd853f",
              pink: "#ffc0cb",
              plum: "#dda0dd",
              powderblue: "#b0e0e6",
              purple: "#800080",
              rebeccapurple: "#663399",
              red: "#ff0000",
              rosybrown: "#bc8f8f",
              royalblue: "#4169e1",
              tan: "#d2b48c",
              teal: "#008080",
              thistle: "#d8bfd8",
              tomato: "#ff6347",
              turquoise: "#40e0d0",
              saddlebrown: "#8b4513",
              salmon: "#fa8072",
              sandybrown: "#f4a460",
              seagreen: "#2e8b57",
              seashell: "#fff5ee",
              sienna: "#a0522d",
              silver: "#c0c0c0",
              skyblue: "#87ceeb",
              slateblue: "#6a5acd",
              slategray: "#708090",
              snow: "#fffafa",
              springgreen: "#00ff7f",
              steelblue: "#4682b4",
              violet: "#ee82ee",
              wheat: "#f5deb3",
              white: "#ffffff",
              whitesmoke: "#f5f5f5",
              yellow: "#ffff00",
              yellowgreen: "#9acd32"
            };
            if (colors[color]) {
              color = colors[color];
            } else if (!color.match(/[0-9a-f]{6}/i)) {
              message.channel.send(lang.config.desc.EMBED_COLOR_ERROR);
              return;
            }
            guildConfig
              .save({
                embedColor: "#" + color.match(/[0-9a-f]{6}/i)[0]
              })
              .then(result => {
                let embed = new discord.RichEmbed()
                  .setColor("#" + color.match(/[0-9a-f]{6}/i)[0])
                  .setDescription(`${lang.config.EMBED_COLOR_SET} \`#"+color.match(/[0-9a-f]{6}/i)[0]+"\`.`);
                message.channel.send(embed);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "emoji-sign-up") {
          if (canConfigure) {
            const emoji = parts.join(" ");
            if (emoji.length > 2 && emoji.match(/\:[^\:]+\:/)) {
              message.channel.send(lang.config.desc.EMOJI_ERROR.replace(/\:char/gi, emoji.replace(/\<|\>/g, "")));
              return;
            }
            guildConfig
              .save({
                emojiAdd: emoji
              })
              .then(result => {
                message.channel.send(lang.config.EMOJI_JOIN_SET);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "emoji-drop-out") {
          if (canConfigure) {
            const emoji = parts.join(" ");
            if (emoji.length > 2 && emoji.match(/\:[^\:]+\:/)) {
              message.channel.send(lang.config.desc.EMOJI_ERROR.replace(/\:char/gi, emoji.replace(/\<|\>/g, "")));
              return;
            }
            guildConfig
              .save({
                emojiRemove: emoji
              })
              .then(result => {
                message.channel.send(lang.config.EMOJI_LEAVE_SET);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "private-reminders") {
          if (canConfigure) {
            guildConfig
              .save({
                privateReminders: !guildConfig.privateReminders
              })
              .then(result => {
                message.channel.send(!guildConfig.privateReminders ? lang.config.PRIVATE_REMINDERS_ON : lang.config.PRIVATE_REMINDERS_OFF);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "password") {
          if (canConfigure) {
            guildConfig
              .save({
                password: parts.join(" ")
              })
              .then(result => {
                message.channel.send(lang.config.PASSWORD_SET);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "toggle-drop-out") {
          if (canConfigure) {
            guildConfig
              .save({
                dropOut: guildConfig.dropOut === false
              })
              .then(result => {
                message.channel.send(guildConfig.dropOut === false ? lang.config.DROP_OUTS_ENABLED : lang.config.DROP_OUTS_DISABLED);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "role") {
          const mentioned = (parts[0] || "").match(/(\d+)/);
          let roleName = parts.join(" ");
          if (roleName.trim() === "All Roles") {
            roleName = "";
          }
          if (mentioned) {
            const roleId = mentioned[0];
            const role = guild.roles.get(roleId);
            if (role) roleName = role.name;
          }
          if (canConfigure) {
            guildConfig
              .save({
                role: roleName == "" ? null : roleName
              })
              .then(result => {
                message.channel.send(roleName.length > 0 ? lang.config.ROLE_SET.replace(/\:role/gi, roleName) : lang.config.ROLE_CLEARED);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "manager-role") {
          const mentioned = (parts[0] || "").match(/(\d+)/);
          let roleName = parts.join(" ");
          if (mentioned) {
            const roleId = mentioned[0];
            const role = guild.roles.get(roleId);
            if (role) roleName = role.name;
          }
          if (canConfigure) {
            guildConfig
              .save({
                managerRole: roleName == "" ? null : roleName
              })
              .then(result => {
                message.channel.send(roleName.length > 0 ? lang.config.ROLE_SET.replace(/\:role/gi, roleName) : lang.config.ROLE_CLEARED);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else if (cmd === "lang") {
          const newLang = languages.find(l => l.code === parts[0].trim());
          if (!newLang) {
            return message.channel.send(lang.config.NO_LANG);
          }
          if (canConfigure) {
            guildConfig
              .save({
                lang: newLang.code
              })
              .then(result => {
                message.channel.send(newLang.config.LANG_SET.replace(/\:lang/gi, newLang.name));
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  /**
   * Discord.JS - messageReactionAdd
   */
  client.on("messageReactionAdd", async (reaction, user) => {
    const message = reaction.message;
    const game = await Game.fetchBy("messageId", message.id);
    try {
      if (game && user.id !== message.author.id) {
        reaction.remove(user);
        const guildConfig = await GuildConfig.fetch(game.s);
        if (reaction.emoji.name === guildConfig.emojiAdd) {
          if (game.reserved.indexOf(user.tag) < 0) {
            game.reserved = [...game.reserved.trim().split(/\r?\n/), user.tag].join("\n");
            if (game.reserved.startsWith("\n")) game.reserved = game.reserved.substr(1);
            game.save();
          }
        }
        if (reaction.emoji.name === guildConfig.emojiRemove) {
          if (game.reserved.indexOf(user.tag) >= 0 && guildConfig.dropOut) {
            game.reserved = game.reserved
              .split(/\r?\n/)
              .filter(tag => tag !== user.tag)
              .join("\n");
            game.save();
          }
        }
      }
    }
    catch(err) {}
  });

  /**
   * Discord.JS - messageDelete
   * Delete the game from the database when the announcement message is deleted
   */
  client.on("messageDelete", async message => {
    const game = await Game.fetchBy("messageId", message.id);
    if (game && message.channel instanceof TextChannel) {
      game.delete().then(result => {
        console.log("Game deleted");
      });
    }
  });

  /**
   * Add events to non-cached messages
   */
  const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove"
  };

  client.on("raw", async (event: any) => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = <TextChannel>client.channels.get(data.channel_id) || (await user.createDM());

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
      const emoji = new discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
      reaction = new discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    client.emit(events[event.t], reaction, user);
  });

  return client;
};

const discordLogin = client => {
  client.login(process.env.TOKEN);
};

const refreshMessages = async () => {
  let games = await Game.fetchAllBy({ when: "datetime", method: "automated", timestamp: { $gte: new Date().getTime() } });
  games.forEach(async game => {
    if (!game.discordGuild) return;

    try {
      const message = await game.discordChannel.fetchMessage(game.messageId);
    } catch (err) {}
  });
};

const pruneOldGames = async () => {
  let result: DeleteWriteOpResultObject;
  console.log("Pruning old games");
  const query = {
    timestamp: {
      // timestamp lower than 48 hours ago
      $lt: new Date().getTime() - 48 * 3600 * 1000
    }
  };

  const games = await Game.fetchAllBy(query);
  const guildConfigs = await GuildConfig.fetchAll();
  games.forEach(async game => {
    if (!game.discordGuild) return;

    try {
      const guildConfig = guildConfigs.find(gc => gc.guild === game.s);
      if ((guildConfig || new GuildConfig()).pruning && game.discordChannel) {
        const message = await game.discordChannel.fetchMessage(game.messageId);
        if (message) message.delete();
        const reminder = await game.discordChannel.fetchMessage(game.reminderMessageId);
        if (reminder) reminder.delete();
      }
    } catch (err) {
      console.log("MessagePruningError:", err);
    }
  });

  try {
    result = await Game.deleteAllBy(query);
    console.log(`${result.deletedCount} old games successfully pruned`);
  } catch (err) {
    console.log("GamePruningError:", err);
  }
  return result;
};

const postReminders = async (app: Express) => {
  let games = await Game.fetchAllBy({ when: "datetime", reminder: { $in: ["15", "30", "60"] } });
  games.forEach(async game => {
    if (game.timestamp - parseInt(game.reminder) * 60 * 1000 > new Date().getTime()) return;
    if (!game.discordGuild) return;

    if (game.discordChannel) {
      const reserved: string[] = [];
      const reservedUsers: discord.GuildMember[] = [];
      game.reserved.split(/\r?\n/).forEach(res => {
        if (res.trim().length === 0) return;
        let member = game.discordGuild.members.array().find(mem => mem.user.tag === res.trim().replace("@", ""));

        let name = res.trim().replace("@", "");
        if (member) name = member.user.toString();
        if (member) reservedUsers.push(member);

        if (reserved.length < parseInt(game.players)) {
          reserved.push(name);
        }
      });

      const member = game.discordGuild.members.array().find(mem => mem.user.tag === game.dm.trim().replace("@", ""));
      let dm = game.dm.trim().replace("@", "");
      let dmMember = member;
      if (member) dm = member.user.toString();

      if (reserved.length > 0) {
        const channels = game.where.match(/#[a-z0-9\-_]+/gi);
        if (channels) {
          channels.forEach(chan => {
            const guildChannel = game.discordGuild.channels.find(c => c.name === chan.replace(/#/, ""));
            if (guildChannel) {
              game.where = game.where.replace(chan, guildChannel.toString());
            }
          });
        }

        const guildConfig = await GuildConfig.fetch(game.discordGuild.id);
        const languages = app.locals.langs;
        const lang = languages.find(l => l.code === guildConfig.lang) || languages.find(l => l.code === "en");

        if (guildConfig.privateReminders) {
          try {
            let message = `${lang.game.REMINDER_FOR} **${game.adventure.replace(/\*/gi, "")}**\n`;
            message += `**${lang.game.WHEN}:** ${lang.game.STARTING_IN.replace(/\:minutes/gi, game.reminder)}\n`;
            message += `**${lang.game.SERVER}:** ${game.discordGuild.name}\n`;
            message += `**${lang.game.WHERE}:** ${game.where}\n`;
            message += `**${lang.game.GM}:** ${dmMember ? dmMember.nickname ? dmMember.nickname : dmMember.user.username : game.dm}\n`;

            for (const member of reservedUsers) {
              if (!dmMember || (dmMember && member.user.username !== dmMember.user.username && member.nickname !== dmMember.nickname)) {
                member.user.send(message);
              }
            }

            if (dmMember && dmMember.user) dmMember.user.send(message);

            game.reminder = "0";
            game.save();
          }
          catch(err) {

          }
        } else {
          let message = `${lang.game.REMINDER_FOR} **${game.adventure.replace(/\*/gi, "")}**\n`;
          message += `**${lang.game.WHEN}:** ${lang.game.STARTING_IN.replace(/\:minutes/gi, game.reminder)}\n`;
          message += `**${lang.game.WHERE}:** ${game.where}\n\n`;
          message += `**${lang.game.GM}:** ${dm}\n`;
          message += `**${lang.game.RESERVED}:**\n`;
          message += `${reserved.join(`\n`)}`;

          const sent = <Message>await game.discordChannel.send(message);

          game.reminder = "0";
          game.reminderMessageId = sent.id;
          game.save();
        }
      }
    }
  });
};

export default {
  processes: discordProcesses,
  login: discordLogin,
  refreshMessages: refreshMessages,
  pruneOldGames: pruneOldGames,
  postReminders: postReminders
};

export function discordClient() {
  return client;
}
