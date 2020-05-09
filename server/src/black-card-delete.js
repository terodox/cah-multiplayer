const buildNewHandForPlayer = require('./build-new-hand-for-player');
const Game = require('./models/game');

module.exports = async function cardsDelete(ctx, gameId) {
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    try {
        let result = await collection.find({ name: gameId }).toArray();
        let game;

        if(result.length > 0) {
            console.log('Found game!');
            game = new Game(result[0]);
        } else {
            ctx.status = 404;
            return;
        }

        const gameFromDb = result[0];

        const newBlackCard = game.blackCardDeck.shift();

        await collection.updateOne({
            _id: gameFromDb._id,
        }, {
            $set: {
                blackCardDeck: game.blackCardDeck,
                currentBlackCard: newBlackCard
            }
        });

        ctx.body = game;
        ctx.status = 200;
    } catch(error) {
        console.error(error);
        ctx.status = 500;
    }
}