const ac = require('argument-contracts').default;

const NONE = -1;
module.exports = class Player {
    constructor({
        name,
        points = 0,
        cards = [],
        selectedCard = NONE,
        isCardTsar = false,
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');
        ac.assertNumber(selectedCard, 'selectedCard');
        ac.assertArrayOf(cards, Number, 'cards');
        ac.assertBoolean(isCardTsar, 'isCardTsar');

        this.name = name;
        this.points = points;
        this.cards = cards;
        this.selectedCard = selectedCard;
        this.isCardTsar = isCardTsar;
    }
};