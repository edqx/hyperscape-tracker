// Imports
import discord from "discord.js"
import numeral from "numeral"
import mkdir from "mkdirp"
import fst from "fs"
import fs from "fs/promises"

import hyperscape from "./hyperscape.js"

const config = JSON.parse(fst.readFileSync("./config.json"));

const client = new discord.Client();

const fmt = num => numeral(num).format("0,0");

/**
 * Update games for a user.
 * @param {String} id The ID of the user to add the games for.
 * @param {Bundle} bundle The bundle of games to add.
 */
async function addGameFor(id, bundle) {
    try {
        if (bundle.range[0] === bundle.range[1]) {
            await fs.writeFile("games/" + id + "/" + bundle.range[0] + ".json", JSON.stringify(bundle));
        } else {
            await fs.writeFile("games/" + id + "/" + bundle.range[0] + "-" + bundle.range[1] + ".json", JSON.stringify(bundle));
        }
    } catch (e) {
        if (e.code === "ENOENT") {
            await mkdir("games/" + id);
            await addGameFor(id, bundle);
        } else {
            console.log("[ERROR] Could not write recorded games.");
        }
    }
}

async function updateStats(stats) {
    await fs.writeFile("stats.json", JSON.stringify(stats));
}

/** Represents a bundle of recorded games. */
class Bundle {
    /**
     * Instantiate a game bundle.
     * @param {Date} time The time that the data was collected.
     * @param {Array<Number>} range The range of games that were collected.
     * @param {any} diff The difference in stats from before to after.
     */
    constructor(time, range, diff) {
        /** 
         * The time that the data was collected.
         * @type {Date}
         */
        this.t = time;

        /** 
         * The number of games that were collected.
         * @type {Number}
         */
        this.games = (range[1] - range[0]) + 1;

        /**
         * The range of games that were collected.
         * @type {Array<Number>}
         */
        this.range = range;

        /**
         * The difference in stats from before to after.
         * @type {any}
         */
        this.diff = diff;
    }
}

const watch = [];

/** @typedef {(import "./hyperscape.js").PlayerStats} PlayerStats */
/** @typedef {(import "./hyperscape.js").UserProfile} UserProfile */

/**
 * Update statistics and watch players for stat updates.
 * @param {Array<UserProfile>} watch The users to watch.
 * @param { { [key: string]: PlayerStats } } stats The stats initially recorded.
 * @param {discord.TextChannel} channel The channel to send the stats to.
 */
async function updateWatched(watch, stats, channel) {
    console.log("[INFO] Gathering user statistics...");

    for (let i in watch) {
        const user = watch[i];

        const profile = await hyperscape.getStats(user.id);

        if (!stats[user.id]) {
            console.log("[INFO] Loaded initial statistics for " + user.id);

            stats[user.id] = profile.stats;
        } else {
            console.log("[INFO] Checking for updates in statistics for user " + user.id);

            const matches = profile.stats.matches - stats[user.id].matches;

            const before = stats[user.id];
            const after = profile.stats;

            const diff = {};

            Object.entries(before).map(([stat, value]) => {
                if (JSON.stringify(after[stat]) !== JSON.stringify(value)) {
                    diff[stat] = [value, after[stat]];
                }
            });

            if (matches > 0) {
                console.log(" - " + matches + " new match" + (matches === 1 ? "" : "es") + " found.");

                const diff = {
                    wins: after.wins - before.wins,
                    crown_wins: after.crown_wins - before.crown_wins,
                    damage: after.damage - before.damage,
                    assists: after.assists - before.assists,
                    matches: after.matches - before.matches,
                    chests_broken: after.chests_broken - before.chests_broken,
                    crown_pickups: after.crown_pickups - before.crown_pickups,
                    damage_done: after.damage_done - before.damage_done,
                    kills: after.kills - before.kills,
                    fusions: after.fusions - before.fusions,
                    last_rank: after.last_rank,
                    revives: after.revives - before.revives,
                    time_played: after.time_played,
                    solo_crown_wins: after.solo_crown_wins - before.solo_crown_wins,
                    squad_crown_wins: after.squad_crown_wins - before.squad_crown_wins,
                    solo_time_played: after.solo_time_played - before.solo_time_played,
                    squad_time_plyed: after.squad_time_played - before.squad_time_played,
                    solo_matches: after.solo_matches - before.solo_matches,
                    squad_matches: after.squad_matches - before.squad_matches,
                    solo_wins: after.solo_wins - before.solo_wins,
                    squad_wins: after.squad_wins - before.squad_wins,
                    career_bests: {
                        fused_to_max: after.career_bests.fused_to_max - before.career_bests.fused_to_max > 0,
                        chests: after.career_bests.chests - before.career_bests.chests > 0,
                        shockwaved: after.career_bests.shockwaed - before.career_bests.shockwaved > 0,
                        damage_done: after.career_bests.damage_done - before.career_bests.damage_done > 0,
                        revealed: after.career_bests.revealed - before.career_bests.revealed > 0,
                        assists: after.career_bests.assists - before.career_bests.assists > 0,
                        damage_shielded: after.career_bests.damage_shielded - before.career_bests.damage_shielded > 0,
                        long_range_kills: after.career_bests.long_range_kills - before.career_bests.long_range_kills > 0,
                        short_range_kills: after.career_bests.short_range_kills - before.career_bests.short_range_kills > 0,
                        kills: after.career_bests.kills - before.career_bests.kills> 0,
                        items_fused: after.career_bests.items_fused - before.career_bests.items_fused > 0,
                        critical_damage: after.career_bests.critical_damage - before.career_bests.critical_damage > 0,
                        survival_time: after.career_bests.survival_time - before.career_bests.survival_time > 0,
                        healed: after.career_bests.healed - before.career_bests.healed > 0,
                        revives: after.career_bests.revives - before.career_bests.revives > 0,
                        snares_triggered: after.career_bests.snares_triggered - before.career_bests.snares_triggered > 0,
                        mines_triggered: after.career_bests.mines_triggered - before.career_bests.mines_triggered > 0
                    },
                    weapon_headshot_damage: after.weapon_headshot_damage - before.weapon_headshot_damage,
                    weapon_body_damage: after.weapon_body_damage - before.weapon_body_damage,
                    damage_by_items: after.damage_by_items - before.damage_by_items,
                    average_kills_per_match: after.average_kills_per_match - before.average_kills_per_match,
                    average_damage_per_kill: after.average_damage_per_kill - before.average_damage_per_kill,
                    losses: after.losses - before.losses,
                    solo_losses: after.solo_losses - before.solo_losses,
                    squad_losses: after.squad_losses - before.squad_losses,
                    winrate: (after.winrate - before.winrate < 0 ? "" : "+") + (after.winrate - before.winrate).toFixed(2),
                    solo_winrate: (after.solo_winrate - before.solo_winrate < 0 ? "" : "+") + (after.solo_winrate - before.solo_winrate).toFixed(2),
                    squad_winrate: (after.squad_winrate - before.squad_winrate < 0 ? "" : "+") + (after.squad_winrate - before.squad_winrate).toFixed(2),
                    crown_pickup_success_rate: (after.crown_pickup_success_rate - before.crown_pickup_success_rate < 0 ? "" : "+") + (after.crown_pickup_success_rate - before.crown_pickup_success_rate).toFixed(2),
                    kd: (after.kd - before.kd < 0 ? "" : "+") + (after.kd - before.kd).toFixed(2),
                    headshot_accuracy: after.headshot_accuracy - before.headshot_accuracy,
                    weapons: Object.fromEntries(Object.entries(after.weapons).map(([weapon, item]) => {
                        return [weapon, {
                            name: item.name,
                            kills: item.kills - before.weapons[weapon].kills,
                            damage: item.damage - before.weapons[weapon].damage,
                            headshot_damage: item.headshot_damage - before.weapons[weapon].headshot_damage,
                            fusions: item.fusions - before.weapons[weapon].fusions,
                            headshot_accuracy: item.headshot_accuracy - before.weapons[weapon].headshot_accuracy
                        }];
                    })),
                    hacks: Object.fromEntries(Object.entries(after.hacks).map(([hack, item]) => {
                        return [hack, {
                            name: item.name,
                            kills: item.kills - before.hacks[hack].kills,
                            damage: item.damage - before.hacks[hack].damage,
                            fusions: item.fusions - before.hacks[hack].fusions,
                        }];
                    }))
                }

                
		        const formatted_date = new Date().toISOString().replace("T", " ").replace("Z", "").replace(/:/g, "-");

                const group = new Bundle(formatted_date, [stats[user.id].matches + 1, profile.stats.matches], diff);

                await addGameFor(user.id, group);
                
                const solo = after.solo_matches - before.solo_matches > 0;
                const won = after.wins - before.wins;

                const best_weapons = Object.values(diff.weapons).filter(a => {
                    return (a.kills + 1) * a.damage;  // Filter weapons that were unused.
                }).sort((a, b) => {
                    return ((b.kills + 1) * b.damage) - ((a.kills + 1) * a.damage); // Sort weapons in descending order based on a formula of `(kills + 1) * damage`
                });

                const most_fused = Object.values(diff.weapons).concat(Object.values(diff.hacks)).filter(a => {
                    return a.fusions; // Filter weapons that were unfused.
                }).sort((a, b) => {
                    return b.fusions - a.fusions; // Sort weapons in descending order based on number of fusions.
                });
                
                const best_weapon = best_weapons[0];
                const second_best = best_weapons[1];
                const the_most_fused = most_fused[0];

                if (matches === 1) {
                    if (solo) {
                        if (channel) {
							await channel.send({
								embed: {
									title: "Game recorded 🕹",
									description: user.name + " just " + (won ? "won" : "finished") + " a solo game (Place #" + after.solo_last_rank + ")",
									color: 0x6977bb,
									fields: [
										{
											name: "Game Overview",
											value: `
	**Game #**: \`${fmt(group.range[0])}\`
	**Kills**: \`${fmt(diff.kills)}\`${diff.career_bests.kills ? " (PB)" : ""}
	**Damage**: \`${fmt(diff.damage_done)}\`${diff.career_bests.damage_done ? " (PB)" : ""}
	**KD change**: \`${diff.kd}\`
	**Solo win rate change**: \`${diff.solo_winrate}%\`
	**Fusions**: \`${fmt(diff.fusions)}\`${diff.career_bests.items_fused ? " (PB)" : ""}
	**Chests**: \`${fmt(diff.chests_broken)}\`${diff.career_bests.chests ? " (PB)" : ""}
	**Best weapon**: ${best_weapon?.name || "N/A"}${best_weapon ? (" (`" + fmt(best_weapon.kills) + "` kill" + (best_weapon.kills === 1 ? ", `" : "s, `") + fmt(best_weapon.damage) + "` damage)") : ""}
	**Second best weapon**: ${second_best?.name || "N/A"}${second_best ? (" (`" + fmt(second_best.kills) + "` kill" + (second_best.kills === 1 ? ", `" : "s, `") + fmt(second_best.damage) + "` damage)") : ""}
	**Most fused item**: ${the_most_fused?.name || "N/A"}${the_most_fused ? (" (`" + fmt(the_most_fused.fusions) + "` fusion" + (the_most_fused.fusions === 1 ? ")" : "s)")) : ""}
	`.trim()
										}
									]
								}
							});
						}
                    } else {
                        if (channel) {
							await channel.send({
								embed: {
									title: "Game recorded 🕹",
									description: user.name + " just " + (won ? "won" : "finished") + " a squad game (Place #" + after.squad_last_rank + ")",
									color: 0x6977bb,
									fields: [
										{
											name: "Game Overview",
											value: `
	**Game #**: \`${fmt(group.range[0])}\`
	**Kills**: \`${fmt(diff.kills)}\`${diff.career_bests.kills ? " (PB)" : ""}
	**Assists**: \`${fmt(diff.assists)}\`${diff.career_bests.assists ? " (PB)" : ""}
	**Revives**: \`${fmt(diff.revives)}\`${diff.career_bests.revives ? " (PB)" : ""}
	**Damage**: \`${fmt(diff.damage_done)}\`${diff.career_bests.damage_done ? " (PB)" : ""}
	**KD change**: \`${diff.kd}\`
	**Squad win rate change**: \`${diff.squad_winrate}%\`
	**Fusions**: \`${fmt(diff.fusions)}\`${diff.career_bests.items_fused ? " (PB)" : ""}
	**Chests**: \`${fmt(diff.chests_broken)}\`${diff.career_bests.chests ? " (PB)" : ""}
	**Best weapon**: ${best_weapon?.name || "N/A"}${best_weapon ? (" (`" + fmt(best_weapon.kills) + "` kill" + (best_weapon.kills === 1 ? ", `" : "s, `") + fmt(best_weapon.damage) + "` damage)") : ""}
	**Second best weapon**: ${second_best?.name || "N/A"}${second_best ? (" (`" + fmt(second_best.kills) + "` kill" + (second_best.kills === 1 ? ", `" : "s, `") + fmt(second_best.damage) + "` damage)") : ""}
	**Most fused item**: ${the_most_fused?.name || "N/A"}${the_most_fused ? (" (`" + fmt(the_most_fused.fusions) + "` fusion" + (the_most_fused.fusions === 1 ? ")" : "s)")) : ""}
	`.trim()
										}
									]
								}
							});
						}
                    }
                } else {
                    if (channel) {
						await channel.send({
                        embed: {
								title: "Games recorded 🕹",
								description: "Multiple games recorded for " + user.name,
								color: 0x6977bb,
								fields: [
									{
										name: "Games Overview",
										value: `
	**Games**: \`${fmt(group.range[0])} - ${fmt(group.range[1])}\` (${fmt(group.games)})
	**Solo wins**: \`${fmt(diff.solo_wins)}\` (\`${diff.solo_winrate}%\`)
	**Squad wins**: \`${fmt(diff.squad_wins)}\` (\`${diff.squad_winrate}%\`)
	**Kills**: \`${fmt(diff.kills)}\`${diff.career_bests.kills ? " (PB)" : ""}
	**Assists**: \`${fmt(diff.assists)}\`${diff.career_bests.assists ? " (PB)" : ""}
	**Revives**: \`${fmt(diff.revives)}\`${diff.career_bests.revives ? " (PB)" : ""}
	**Damage**: \`${fmt(diff.damage_done)}\`${diff.career_bests.damage_done ? " (PB)" : ""}
	**KD change**: \`${diff.kd}\`
	**Win rate change**: \`${diff.winrate}%\`
	**Fusions**: \`${fmt(diff.fusions)}\`${diff.career_bests.items_fused ? " (PB)" : ""}
	**Chests**: \`${fmt(diff.chests_broken)}\`${diff.career_bests.chests ? " (PB)" : ""}
	**Best weapon**: ${best_weapon?.name || "N/A"}${best_weapon ? (" (`" + fmt(best_weapon.kills) + "` kill" + (best_weapon.kills === 1 ? ", `" : "s, `") + fmt(best_weapon.damage) + "` damage)") : ""}
	**Second best weapon**: ${second_best?.name || "N/A"}${second_best ? (" (`" + fmt(second_best.kills) + "` kill" + (second_best.kills === 1 ? ", `" : "s, `") + fmt(second_best.damage) + "` damage)") : ""}
	**Most fused item**: ${the_most_fused?.name || "N/A"}${the_most_fused ? (" (`" + fmt(the_most_fused.fusions) + "` fusion" + (the_most_fused.fusions === 1 ? ")" : "s)")) : ""}
	`.trim()
									} // `
								]
							}
						});
					}
                }
                
    
                stats[user.id] = profile.stats;
    
                await updateStats(stats);
            } else {
                console.log(" - no new matches found.");
            }
        }
    }
}

const esc = str => str.replace(/\*/g, "\\*").replace(/\`/g, "\\`").replace(/\_/g, "\\_");

let before = {};
let channel = null;

let msgs = {};

client.on("message", async message => {
	const args = message.content.split(" ");
	
	const rest = () => args.join(" ");
	
	const cmd = args.shift();
	
	if (!msgs[message.channel.id]) msgs[message.channel.id] = [];
	
	if (cmd === "/watching") {
		if (watch.length) {
			const msg = await message.channel.send("I am watching: " + watch.map(user => "**" + esc(user.name) + "**").join(", "));
		
			msgs[message.channel.id].push(message.id);
			msgs[message.channel.id].push(msg.id);
		} else {
			const msg = await message.channel.send("I am not watching anyone.");
		
			msgs[message.channel.id].push(message.id);
			msgs[message.channel.id].push(msg.id);
		}
	} else if (cmd === "/stop") {
		const username = rest();
		
		const cindex = config.watch.findIndex(_ => _.username.toLowerCase() === username.toLowerCase());
		const windex = watch.findIndex(_ => _.name.toLowerCase() === username.toLowerCase());
		
		if (~cindex && ~windex) {
			watch.splice(windex, 1);
			config.watch.splice(cindex, 1);
			
			await fs.writeFile("config.json", JSON.stringify(config));
			
			const msg = await message.channel.send("Stopped watching **" + esc(username) + "**");
			
			msgs[message.channel.id].push(message.id);
			msgs[message.channel.id].push(msg.id);
		} else {
			const msg = await message.channel.send("I am not watching **" + esc(username) + "**");
			
			msgs[message.channel.id].push(message.id);
			msgs[message.channel.id].push(msg.id);
		}
	} else if (cmd === "/watch") {
		let platform = "uplay";
		
		if (~["uplay", "pc", "xbox", "xbl", "psn", "ps", "ps4", "ps5"].indexOf(args[0]) && args[1]) {
			const inp = args.shift();
			
			platform = ~["uplay", "pc"].indexOf(inp) ? "uplay" : ~["xbox", "xbl"].indexOf(inp) ? "xbl" : ~["psn", "ps", "ps4", "ps5"].indexOf(inp);
		}
		
		const username = rest();
		
		try {
			const cindex = config.watch.findIndex(_ => _.username.toLowerCase() === username.toLowerCase());
			const windex = watch.findIndex(_ => _.name.toLowerCase() === username.toLowerCase());
		
			if (~cindex && ~windex) {
				const msg = await message.channel.send("I am already watching **" + esc(username) + "**");
				
				msgs[message.channel.id].push(message.id);
				msgs[message.channel.id].push(msg.id);
			} else {
				const profile = await hyperscape.getUser(platform, username);
			
				loadUser(profile);
				
				config.watch.push({
					username,
					platform
				});
				
				await fs.writeFile("config.json", JSON.stringify(config));
				
				const msg = await message.channel.send("Now watching **" + esc(username) + "**");
				
				msgs[message.channel.id].push(message.id);
				msgs[message.channel.id].push(msg.id);
			}
		} catch (e) {
			console.error(e);
			
			const msg = await message.channel.send("Error occurred while adding **" + esc(username) + "**, see console for more details.");
			
			msgs[message.channel.id].push(message.id);
			msgs[message.channel.id].push(msg.id);
		}
	} else if (cmd === "/clean") {
		msgs[message.channel.id].push(message.id);
		
		message.channel.bulkDelete(msgs[message.channel.id].splice(msgs[message.channel.id].length - 90));
	}
});

function loadUser(profile) {
	watch.push(profile);
	
	console.log("[INFO] Loaded user " + profile.name + " on " + profile.platform + " (" + profile.id + ")");
}

client.on("ready", async () => {
	console.log("Bot logged in!");

	const guild = client.guilds.resolve(config.bot.guild);
	await guild.fetch();

	channel = guild.channels.resolve(config.bot.channel);
	await channel.fetch();

	try {
		before = JSON.parse(await fs.readFile("stats.json"));
		
		for (let i in config.watch) {
			const user = config.watch[i];

			const profile = user.id ? await hyperscape.getUserByID(user.id) : await hyperscape.getUser(user.platform, user.username);
			
			loadUser(profile);
		}

		setInterval(() => updateWatched(watch, before, channel), config.every);

		updateWatched(watch, before, channel);
	} catch (e) {
		if (e.code === "ENOENT") {
			await fs.writeFile("stats.json", "{}");
		} else {
			if (e.code) {
				console.log("[ERROR] Could not get last statistics. " + e.code);
			} else {
				console.log("[ERROR]", e);
			}
		}
	}
});

(async function index() {
    await client.login(config.bot.token);
})();