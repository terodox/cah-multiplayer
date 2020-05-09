const buildNewHandForPlayer = require('./build-new-hand-for-player');
const Game = require('./models/game');

module.exports = async function cardsDelete(ctx, gameId, playerId) {
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
        const foundPlayer = game.players.find(gamePlayer => gamePlayer.name === playerId);

        if(!foundPlayer) {
            ctx.status = 404;
            return;
        }
        const foundPlayerIndex = game.players.indexOf(foundPlayer);
console.log('game.whiteCardDeck', game.whiteCardDeck);
        const {
            whiteDeck: updatedWhiteDeck,
            playerHand
        } = buildNewHandForPlayer({ whiteDeck: game.whiteCardDeck });

        console.log('Player getting a new cards', playerId, playerHand);

        await collection.updateOne({
            _id: gameFromDb._id,
        }, {
            $set: {
                whiteCardDeck: updatedWhiteDeck,
                [`players.${foundPlayerIndex}.cards`]: playerHand
            }
        });

        ctx.body = game;
        ctx.status = 200;
    } catch(error) {
        console.error(error);
        ctx.status = 500;
    }
}