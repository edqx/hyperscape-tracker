import fetch from "node-fetch"

/**
 * @typedef PlayerCareerBests
 * @property {Number} fused_to_max The most number of guns fused to max.
 * @property {Number} chests The most number of chests opened.
 * @property {Number} shockwaved The most number of shockwaves inflicted.
 * @property {Number} damage_done The most number of damage points dealt.
 * @property {Number} revealed The most number of players revealed.
 * @property {Number} assists The most number of assists.
 * @property {Number} damage_shielded The most number of damage blocked.
 * @property {Number} long_range_kills The most number of long range kills.
 * @property {Number} short_range_kills The most number of short range kills.
 * @property {Number} kills The most number of kills.
 * @property {Number} items_fused The most number of items fused.
 * @property {Number} critical_damage The most critical damage dealt.
 * @property {String} survival_time The longest time survived.
 * @property {Number} healed The most number of health points healed.
 * @property {Number} revives The most revives.
 * @property {Number} snares_triggered
 * @property {Number} mines_triggered The most number of mines triggered.
 */

/**
 * @typedef ItemStats
 * @property {String} name The name of the weapon.
 * @property {Number} kills The number of kills that the weapon has gotten.
 * @property {Number} damage The damage that the weapon has dealt.
 * @property {Number} headshot_damage The headshot damage that the weapon has dealt.
 * @property {Number} fusions The number of fusions that the weapon has done.
 * @property {Number} headshot_accuracy The headshot accuracy of the weapon.
 */

/**
 * @typedef PlayerWeaponStats
 * @property {ItemStats} dragonfly The stats for the dragon fly.
 * @property {ItemStats} mammoth The stats for the mammoth mk1.
 * @property {ItemStats} theripper The stats for the Ripper.
 * @property {ItemStats} dtap The stats for the DTap.
 * @property {ItemStats} harpy The stats for the Harpy.
 * @property {ItemStats} homodo The stats for the komodo.
 * @property {ItemStats} hexfire The stats for the Hexfire.
 * @property {ItemStats} riotone The stats for the RiotOne.
 * @property {ItemStats} salvoepl The stats for the Salvo EPL.
 * @property {ItemStats} skybreaker The stats for the Skybreaker.
 * @property {ItemStats} protocolv The stats for the Protocol V.
 */

/**
 * @typedef PlayerHackStats
 * @property {ItemStats} mine The stats for the mine.
 * @property {ItemStats} slam The stats for the slam.
 * @property {ItemStats} shockwave The stats for the shockwave.
 * @property {ItemStats} wall The stats for the shockwave.
 * @property {ItemStats} heal The stats for the Heal.
 * @property {ItemStats} reveal The stats for the Reveal.
 * @property {ItemStats} teleport The stats for the Teleport.
 * @property {ItemStats} ball The stats for the Ball.
 * @property {ItemStats} invisibility The stats for the Invisibility.
 * @property {ItemStats} armour The stats for the Armour.
 * @property {ItemStats} magnet The stats for the Magnet.
 */

/**
 * @typedef PlayerStats
 * @property {Number} wins The number of wins that the player has.
 * @property {Number} crown_wins The number of wins that the player has from keeping the crown.
 * @property {Number} damage The number of damage points that the player has took.
 * @property {Number} assists The number of assists that the player has got.
 * @property {Number} matches The number of matches that the player has played.
 * @property {Number} chests_broken The number of chests that the player has broken.
 * @property {Number} crown_pickups The number of crowns that the player has picked up.
 * @property {Number} damage_done The number of damage points that the player has dealt.
 * @property {Number} kills The number of kills that the player has.
 * @property {Number} fusions The number of fusions that the player has made.
 * @property {Number} last_rank The last rank of the player.
 * @property {Number} revives The number of people that the player has revived.
 * @property {String} time_played The time that the player has played for (formatted).
 * @property {Number} solo_crown_wins The number of crown wins that the player has gotten in solo.
 * @property {Number} squad_crown_wins The number of crown wins that the player has gotten in squdas.
 * @property {Number} solo_last_rank The last rank of the player on solo.
 * @property {Number} squad_last_rank The last rank of the player on squad.
 * @property {String} solo_time_played The time that the player has played in solo.
 * @property {String} squad_time_played The time that the player has played in squads.
 * @property {Number} solo_matches The number of matches that the player has played has on solo.
 * @property {Number} squad_matches The number of matches that the player has played on squads.
 * @property {Number} solo_wins The number of wins that the player has on solo.
 * @property {Number} squad_wins The number of wins that the player has on squauds.
 * @property {PlayerCareerBests} career_bests The best of stats the player has ever gotten.
 * @property {Number} weapon_headshot_damage The number of damage points dealt with headshots
 * @property {Number} weapon_body_damage The number of damage points dealt with body shots.
 * @property {Number} damage_by_items The number of damage dealt with items. (?)
 * @property {Number} average_kills_per_match The average number of kills that the player gets per match.
 * @property {Number} average_damage_per_kill The average amount of damage dealt per kill.
 * @property {Number} losses The number of games that the player has lost.
 * @property {Number} solo_losses The number of games that the player has lost in solo.
 * @property {Number} squad_losses The number of games that the player has won in squads.
 * @property {Number} winrate The rate that the player wins a game.
 * @property {Number} solo_winrate The rate that the player wins a solo game.
 * @property {Number} squad_winrate The rate that the player wins a squad game.
 * @property {Number} crown_pickup_success_rate The rate that a crown pickup results in a win.
 * @property {Number} kd The kills to death ratio for the player.
 * @property {Number} headshot_accuracy The accuracy in which the player gets a headshot.
 * @property {PlayerWeaponStats} weapons The stats for individual weapons.
 * @property {PlayerHackStats} hacks The stats for the individual hacks.
 */

/**
 * @typedef UserProfile
 * @property {String} id The ID of the user.
 * @property {String} name The name of the user.
 * @property {String} platform The platform of the user.
 */

/**
 * @typedef UserProfileStats
 * @property {UserProfile} profile The profile of the user.
 * @property {PlayerStats} stats The stats of the user.
 */

/**
 * Parse a percentage into a fraction of 1.
 * @param {String} perc The percentage to parse.
 * @returns {Number}
 */
function parsePerc(perc) {
    return Math.floor(parseFloat(perc) * 100) / 100
}

export async function calculateDiff(before, after) {
    return {
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
            kills: after.career_bests.kills- before.career_bests.kills> 0,
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
}

/**
 * Get the stats of a player by their ID.
 * @param {String} id The ID of the player.
 * @returns {UserProfileStats}
 */
export async function getStats(id) {
    const res = await fetch("https://hypers.apitab.com/update/" + id);

    if (res.status === 200) {
        const json = await res.json();

        if (!json.status || json.status === 200) {
            const stats = json.data.stats;
            const weapons = json.data.weapons;
            const hacks = json.data.hacks;

            /** @type {UserProfileStats} */
            const ret = {
                profile: {
                    id: json.player.p_id,
                    name: json.player.p_name,
                    platform: json.player.p_platform
                },
                stats: {
                    wins: stats.wins,
                    crown_wins: stats.crown_wins,
                    damage: stats.damage,
                    assists: stats.assists,
                    matches: stats.matches,
                    chests_broken: stats.chests_broken,
                    crown_pickups: stats.crown_pickups,
                    damage_done: stats.damage_done,
                    kills: stats.kills,
                    fusions: stats.fusions,
                    last_rank: stats.last_rank,
                    revives: stats.revives,
                    time_played: stats.time_played,
                    solo_crown_wins: stats.solo_crown_wins,
                    squad_crown_wins: stats.squad_crown_wins,
                    solo_last_rank: stats.solo_last_rank,
                    squad_last_rank: stats.squad_last_rank,
                    solo_time_played: stats.solo_time_played,
                    squad_time_played: stats.squad_time_played,
                    solo_matches: stats.solo_matches,
                    squad_matches: stats.squad_matches,
                    solo_wins: stats.solo_wins,
                    squad_wins: stats.squad_wins,
                    career_bests: {
                        fused_to_max: stats.careerbest_fused_to_max,
                        chests: stats.careerbest_chests,
                        shockwaved: stats.careerbest_shockwaved,
                        damage_done: stats.careerbest_damage_done,
                        revealed: stats.careerbest_revealed,
                        assists: stats.careerbest_assists,
                        damage_shielded: stats.careerbest_damage_shielded,
                        long_range_kills: stats.careerbest_long_range_final_blows,
                        short_range_kills: stats.careerbest_short_range_final_blows,
                        kills: stats.careerbest_kills,
                        items_fused: stats.careerbest_item_fused,
                        critical_damage: stats.careerbest_critical_damage,
                        survival_time: stats.careerbest_survival_time,
                        healed: stats.careerbest_healed,
                        revives: stats.careerbest_revives,
                        snares_triggered: stats.careerbest_snare_triggered,
                        mines_triggered: stats.careerbest_mines_triggered
                    },
                    weapon_headshot_damage: stats.weapon_headshot_damage,
                    weapon_body_damage: stats.weapon_body_damage,
                    damage_by_items: stats.damage_by_items,
                    average_kills_per_match: parseFloat(stats.avg_kills_per_match),
                    average_damage_per_kill: parseFloat(stats.avg_dmg_per_kill),
                    losses: stats.losses,
                    solo_losses: stats.solo_losses,
                    squad_losses: stats.squad_losses,
                    winrate: parsePerc(stats.winrate),
                    solo_winrate: parsePerc(stats.solo_winrate),
                    squad_winrate: parsePerc(stats.squad_winrate),
                    crown_pickup_success_rate: parsePerc(stats.crown_pick_success_rate),
                    kd: stats.kd,
                    headshot_accuracy: parsePerc(stats.headshot_accuracy),
                    weapons: Object.fromEntries(Object.entries(weapons).map(([name, stat]) => {
                        return [name.match(/[a-zA-Z]/g).join(""), {
                            name: name,
                            kills: stat.kills,
                            damage: stat.damage,
                            headshot_damage: stat.headshot_damage,
                            fusions: stat.fusions,
                            headshot_accuracy: stat.hs_accuracy
                        }]
                    })),
                    hacks: Object.fromEntries(Object.entries(hacks).map(([name, stat]) => {
                        return [name.match(/[a-zA-Z]/g).join(""), {
                            name: name,
                            kills: stat.kills,
                            damage: stat.damage,
                            headshot_damage: stat.headshot_damage,
                            fusions: stat.fusions
                        }]
                    }))
                }
            }
            
            return ret;
        } else {
            throw json.status;
        }
    } else {
        throw res.status;
    }
}

/**
 * Get user information by platform and username.
 * @param {String} platform The platform of the player.
 * @param {String} username The username of the player.
 * @returns {UserProfile}
 */
export async function getUser(platform, username) {
    const res = await fetch("https://hypers.apitab.com/search/" + platform  + "/" + username);

    if (res.status === 200) {
        const search = await res.json();

        if (!search.status || search.status === 200) {
            if (Object.values(search.players).length) {
                const profile = Object.values(search.players)[0].profile;

                return {
                    id: profile.p_id,
                    name: profile.p_name,
                    platform: profile.p_platform
                }
            } else {
                throw 404;
            }
        } else {
            throw search.status;
        }
    } else {
        throw res.status;
    }
}

/**
 * Get user information by their ID.
 * @param {String} id The ID of the user.
 * @returns {Promise<UserProfile>}
 */
export async function getUserByID(id) {
    const stats = await getStats(id);
    
    return stats.profile;
}

export default {
    calculateDiff,
    getStats,
    getUser,
    getUserByID
}