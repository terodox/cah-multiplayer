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

        let patchBody = ctx.request.body;
        if(typeof ctx.request.body === 'string') {
            patchBody = JSON.parse(ctx.request.body);
        }

        // TODO validate card is in hand

        if(!patchBody.selectedCard) {
            ctx.status = 204;
            return;
        }

        const gameFromDb = result[0];
        const game = new Game(gameFromDb);
        const foundPlayer = game.players.find(gamePlayer => gamePlayer.name === player.name);
        const foundPlayerIndex = game.players.indexOf(foundPlayer);
        console.log('foundPlayerIndex', foundPlayer);
        if(foundPlayer) {
            const updatedPlayer = new Player({
                ...foundPlayer,
                ...patchBody
            });

            console.log('Patched player', updatedPlayer);

            await collection.updateOne({
                _id: gameFromDb._id,
            }, {
                $set: {
                    [`players.${foundPlayerIndex}`]: updatedPlayer
                }
            });
        } else {
            ctx.status = 404;
            return;
        }
        ctx.status = 204;
    } catch(error) {
        console.log(error);
        ctx.status = 500;
        //This is a comment
    }
}