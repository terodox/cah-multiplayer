module.exports = async function cardsRoute(ctx) {
    const allBlackCards = require('./card-data.json').blackCards;
    const randomIndex = Math.floor((Math.random() * allBlackCards.length) + 1);
    ctx.body = {
        text: allBlackCards[randomIndex].text
    }
}