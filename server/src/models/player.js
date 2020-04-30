const ac = require('argument-contracts').default;

module.exports = class Player {
    constructor({
        name,
        points = 0,
        cards = []
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');
        ac.assertArrayOf(cards, Number, 'cards');

        this.name = name;
        this.points = points;
        this.cards = cards;
    }
};