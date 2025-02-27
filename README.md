# RPG Schedule

A discord bot for posting game announcements for RPGs. Features include:

- Web interface for posting and editing game announcements
- Automated or manual sign ups and automated waitlisting
- Automated reminders

**Note:** Games are automatically pruned 48 - 72 hours after the scheduled time. Or you can delete them manually.

<details>
  <summary>Screenshots</summary>
  <a href="http://rpg-schedule.herokuapp.com/images/screenshot3.png" target="_blank" style="display: inline-flex; height: 200px;"><img src="http://rpg-schedule.herokuapp.com/images/screenshot3.png" style="max-width: 100%; max-height: 100%;"></a>
  <a href="http://rpg-schedule.herokuapp.com/images/screenshot4.png" target="_blank" style="display: inline-flex; height: 200px;"><img src="http://rpg-schedule.herokuapp.com/images/screenshot4.png" style="max-width: 100%; max-height: 100%;"></a>
  <a href="http://rpg-schedule.herokuapp.com/images/screenshot.png" target="_blank" style="display: inline-flex; height: 200px;"><img src="http://rpg-schedule.herokuapp.com/images/screenshot.png" style="max-width: 100%; max-height: 100%;"></a>
  <a href="http://rpg-schedule.herokuapp.com/images/screenshot2.png" target="_blank" style="display: inline-flex; height: 200px;"><img src="http://rpg-schedule.herokuapp.com/images/screenshot2.png" style="max-width: 100%; max-height: 100%;"></a>
</details>

## Inviting the discord bot

You can invite the discord bot to your server with the following link:

https://rpg-schedule.herokuapp.com

## Command List

<table>
<thead>
<tr>
<th>Command&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Default&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>General Commands</strong></td>
<td></td>
<td></td>
</tr>
<tr>
<td>!schedule</td>
<td></td>
<td>Displays the help menu</td>
</tr>
<tr>
<td>!schedule help</td>
<td></td>
<td>Displays the help menu</td>
</tr>
<tr>
<td><strong>Configuration</strong></td>
<td></td>
<td></td>
</tr>
<tr>
<td>!schedule configuration</td>
<td></td>
<td>Get the bot configuration</td>
</tr>
<tr>
<td>!schedule add-channel <code>#channel-name</code></td>
<td>first text channel</td>
<td>Add a channel where games are posted (recommended)</td>
</tr>
<tr>
<td>!schedule remove-channel <code>#channel-name</code></td>
<td></td>
<td>Remove a channel where games are posted</td>
</tr>
<tr>
<td>!schedule pruning <code>on/off</code></td>
<td>off</td>
<td>Automatically delete old game announcements. As noted above, games over 48 hours past their scheduled date are automatically pruned from the database. However, by default the announcements are not.</td>
</tr>
<tr>
<td>!schedule embeds <code>on/off</code></td>
<td>on</td>
<td>Use discord embeds for announcements</td>
</tr>
<tr>
<td>!schedule embed-color <code>color</code></td>
<td>#2196f3</td>
<td>Set a discord embed color. Can be a color name like <code>red</code> or a hexadecimal color like <code>#2196f3</code></td>
</tr>
<tr>
<td>!schedule emoji-sign-up ➕</td>
<td>➕</td>
<td>Set the emoji used for automated sign up</td>
</tr>
<tr>
<td>!schedule emoji-drop-out ➖</td>
<td>➖</td>
<td>Set the emoji used for automated sign up</td>
</tr>
<tr>
<td>!schedule private-reminders</td>
<td>Off</td>
<td>Toggle whether the game reminders are sent to private messages.</td>
</tr>
<tr>
<td>!schedule role <code>role name</code></td>
<td>All Roles</td>
<td>Assign a role as a prerequisite for posting games</td>
</tr>
<tr>
<td>!schedule manager-role <code>role name</code></td>
<td>Server Admins</td>
<td>Assign a role to allow managing all server games</td>
</tr>
<tr>
<td>!schedule password <code>password</code></td>
<td>disabled</td>
<td>Configure a password for posting games</td>
</tr>
<tr>
<td>!schedule password</td>
<td></td>
<td>Remove the password</td>
</tr>
<tr>
<td>!schedule toggle-drop-out</td>
<td>Off</td>
<td>Enable/disable the ability for players to drop out</td>
</tr>
<tr>
<td>!schedule lang <code>en</code></td>
<td><code>en</code> (English)</td>
<td>Set the bot's language.</td>
</tr>
<tr>
<td><strong>Usage</strong></td>
<td></td>
<td></td>
</tr>
<tr>
<td>!schedule link</td>
<td></td>
<td>Retrieve the link for posting games</td>
</tr>
</tbody>
</table>

## About the bot

The discord bot is deployed with Heroku as a Node.js and discord.js application and MongoDB for data storage. When an update is pushed to this repository, the update is automatically deployed to Heroku.

Donate: https://www.paypal.me/Sillvva
