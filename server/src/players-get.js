const Game = require('./models/game');
const Player = require('./models/player');

module.exports = async function playersGet(ctx, gameId, playerId) {
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');

    let player;
    try {
        console.log('PlayerId:', playerId);
        player = new Player({
            name: playerId
        });
    } catch(error) {
        console.error(error);
        ctx.status = 400;
        ctx.body = { errorMessage: error.message };
        return;
    }

    try {
        let result = await collection.find({ name: gameId }).toArray();
        console.log('Get result', result);

        if(result.length === 0) {
            ctx.status = 404;
            return;
        }

        const gameFromDb = result[0];
        const game = new Game(gameFromDb);
        const foundPlayer = game.players.find(gamePlayer => gamePlayer.name === player.name);
        if(foundPlayer) {
            ctx.body = foundPlayer
        } else {
            const updatedPlayerArray = [
                ...game.players,
                player
            ];
            await collection.update({
                _id: gameFromDb._id
            },
            {
                $set: {
                    players: updatedPlayerArray
                }
            });
            ctx.body = player;
        }
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.status = 500;
    }
}