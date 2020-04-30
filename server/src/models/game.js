const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const GameStatus = require('./game-status');
const Player = require('./player');

module.exports = class Game {
    constructor({
        name,
        status = GameStatus.WAITING_FOR_PLAYERS,
        players = [],
        consumedWhiteCards = [],
        consumedBlackCards = [],
        currentBlackCard = -1,
    }) {
        ac.assertString(name, 'name');
        ac.assertArrayOf(consumedWhiteCards, Number, 'consumedWhiteCards');
        ac.assertArrayOf(consumedBlackCards, Number, 'consumedBlackCards');
        if(!GameStatus.isValid(status)) {
            throw new TypeError(`status must be a valid GameStatus. Provided value: ${status}`);
        }
        ac.assertNumber(currentBlackCard, 'currentBlackCard');

        this.name = name;
        this.status = status;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
        this.consumedWhiteCards = consumedWhiteCards;
        this.consumedBlackCards = consumedBlackCards;
        this.currentBlackCard = currentBlackCard;
    }
}