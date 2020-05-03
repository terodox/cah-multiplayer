const ac = require('argument-contracts').default;
const { coerceArray } = require('@meltwater/coerce');
const GameStatus = require('./game-status');
const Player = require('./player');

module.exports = class Game {
    constructor({
        name,
        status = GameStatus.WAITING_FOR_PLAYERS,
        players = [],
        currentBlackCard = -1,
        whiteCardDeck = [],
        blackCardDeck = [],
        lastBlackCard = -1,
        lastTsarSelection = -1,
        lastWinnerPlayerIndex = -1
    }) {
        ac.assertString(name, 'name');
        if(!GameStatus.isValid(status)) {
            throw new TypeError(`status must be a valid GameStatus. Provided value: ${status}`);
        }
        ac.assertNumber(currentBlackCard, 'currentBlackCard');
        ac.assertNumber(lastBlackCard, 'lastBlackCard');
        ac.assertNumber(lastTsarSelection, 'lastTsarSelection');
        ac.assertNumber(lastWinnerPlayerIndex, 'lastWinnerPlayerIndex');
        ac.assertArrayOf(whiteCardDeck, Number, 'whiteCardDeck');
        ac.assertArrayOf(blackCardDeck, Number, 'blackCardDeck');

        this.name = name;
        this.status = status;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
        this.whiteCardDeck = whiteCardDeck;
        this.blackCardDeck = blackCardDeck;
        this.currentBlackCard = currentBlackCard;
        this.lastBlackCard = lastBlackCard;
        this.lastTsarSelection = lastTsarSelection;
        this.lastWinnerPlayerIndex = lastWinnerPlayerIndex;
    }
}