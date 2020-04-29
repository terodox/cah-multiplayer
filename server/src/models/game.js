const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const Player = require('./player');

module.exports = class Game {
    constructor({
        name,
        players =[],
    }) {
        ac.assertString(name, 'name');

        this.name = name;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
    }
}