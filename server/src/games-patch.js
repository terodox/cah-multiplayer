const Game = require('./models/game');
const GameStatus = require('./models/game-status');

module.exports = async function gamesGet(ctx, gameId) {
    console.log('Patching game by id:', gameId);
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    try {
        let result = await collection.find({ name: gameId }).toArray();
        console.log('Get result', result);

        let game;
        if(result.length === 0) {
            ctx.status = 404;
            return;
        } else {
            const gameFromDb = result[0];
            const patchBody = JSON.parse(ctx.request.body);
            const game = new Game({
                ...gameFromDb,
                ...patchBody
            })

            if(game.status === GameStatus.STARTING_GAME) {
                // Game initialization!
                // Distribute 7 random cards to each player
                // Mark all cards as consumed
                // Player[0] is selected as card tsar
                // status moves to PLAYING
            }

            await collection.update({
                _id: gameFromDb._id
            },
            {
                $set: game
            });

            ctx.status = 204;
        }
    } catch(error) {
        console.error(error);
        ctx.status = 500;
    }
}