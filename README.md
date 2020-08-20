# hyperscape-tracker
A small Discord bot written in Node.js (using discord.js) to track HyperScape games.

## How it works
Retrieves stats from the api every (x) seconds and checks for updates in number of games played, then calculates the difference for each statistic to record.

## Installation

### Prerequisites
* [Node.js](https://nodejs.org) (v12.0.0 or newer)
* [NPM](https://npmjs.org) (Comes with node)
* Optionally, [Git](https://git-scm.com/) (To clone repository)
* A command line of your choice.
* A discord application created at https://discord.com/developers/applications as a bot user.

## Clone repo
If you have git installed, run `git clone https://github.com/edqx/hyperscape-tracker.git` in your chosen command line in a directory to install the repository, you can also download the repository as a compressed `.zip` file in the "code" dropdown on github.

## Install packages
Enter the installation directory with a command line using `cd` (i.e `cd hyperscape-tracker`), run `npm install` to install all required node packages.

## Configure the tracker
You can edit the `config.json` file to configure the tracker to your needs, an example configuration would look like:
```json
{
    "every": 75000,
    "bot": {
        "token": "",
        "guild": "",
        "channel": ""
    },
    "watch": [
        {
            "username": "weak_eyes",
            "platform": "uplay"
        }
	]
}
```
The `every` option is how often to update the stats in miliseconds.

The `token` option is the bot token that is given in your application's bot user page.
The `guild` option is the ID of the server to send the match information to.
The `channel` option is the ID of the channel to send the match information in.

The `watch` option is a comma-delimited array of all of the users to track, it should be an object supplied with both a `username` and `platform` option being the username of the user and the platform of the user respectively.

## Run the bot
You can run the bot in the same directory using `npm start` or `node index.js`. This should log in the bot, initialise all users and begin recording games.

## Issues
If you have any issues, file them at https://github.com/edqx/hyperscape-tracker/issues and I will help out.

### Notes
I use [tabstat](https://tabstats.com)'s free, unlimited API at https://hypers.apitab.com/ with documentation available at https://github.com/Tabwire/HyperScape-API.

[This repository is available under the MIT license], which means I am not responsible for anything you do with this program.