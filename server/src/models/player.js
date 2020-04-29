const ac = require('argument-contracts').default;

module.exports = class Player {
    constructor({
        name,
        points = 0
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');

        this.name = name;
        this.points = points;
    }
};