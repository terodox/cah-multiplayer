const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const GameStatus = require('./game-status');
const Player = require('./player');
const { Deck } = require('./deck');

module.exports = class Game {
    constructor({
        name,
        status = GameStatus.WAITING_FOR_PLAYERS,
        players = [],
        currentBlackCard = -1,
        whiteCardDeck = [],
        blackCardDeck = [],
    }) {
        ac.assertString(name, 'name');
        if(!GameStatus.isValid(status)) {
            throw new TypeError(`status must be a valid GameStatus. Provided value: ${status}`);
        }
        ac.assertNumber(currentBlackCard, 'currentBlackCard');
        ac.assertArrayOf(whiteCardDeck, Number, 'whiteCardDeck');
        ac.assertArrayOf(blackCardDeck, Number, 'blackCardDeck');

        this.name = name;
        this.status = status;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
        this.whiteCardDeck = whiteCardDeck;
        this.blackCardDeck = blackCardDeck;
        this.currentBlackCard = currentBlackCard;
    }
}