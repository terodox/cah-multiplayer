const ac = require('argument-contracts').default;
const PlayerStatus = require('./player-status');

const NONE = -1;
module.exports = class Player {
    constructor({
        name,
        points = 0,
        cards = [],
        selectedCard = NONE,
        status = PlayerStatus.PLAYING,
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');
        ac.assertNumber(selectedCard, 'selectedCard');
        ac.assertArrayOf(cards, Number, 'cards');
        if(!PlayerStatus.isValid(status)) {
            throw new TypeError(`status must be a valid PlayerStatus. Provided value: ${status}`);
        }

        this.name = name;
        this.points = points;
        this.cards = cards;
        this.status = status;
        this.selectedCard = selectedCard;
    }
};