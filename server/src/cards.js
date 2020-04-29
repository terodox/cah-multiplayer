module.exports = async function cardsRoute(ctx) {
    ctx.body = require('./card-data.json');
}