const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const GameStatus = require('./game-status');
const Player = require('./player');

module.exports = class Game {
    constructor({
        name,
        status = GameStatus.WAITING_FOR_PLAYERS,
        players =[],
    }) {
        ac.assertString(name, 'name');
        if(!GameStatus.isValid(status)) {
            throw new TypeError(`status must be a valid GameStatus. Provided value: ${status}`);
        }

        this.name = name;
        this.status = status;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
    }
}