const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const Player = require('./player');

module.exports = class Game {
    constructor({
        name,
        maxPlayers,
        players,
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(maxPlayers, 'maxPlayers');

        this.name = name;
        this.maxPlayers = maxPlayers;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
    }
}