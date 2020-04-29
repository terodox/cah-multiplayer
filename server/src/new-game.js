const Game = require('./models/game');

module.exports = async function newGame(ctx) {
    let game;
    try {
        const body = JSON.parse(ctx.request.body);
        console.log(body);
        game = new Game(body);
    } catch(error) {
        console.error(error);
        ctx.status = 400;
        ctx.body = { errorMessage: error.message };
        return;
    }

    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    await collection.insertOne(game);
    ctx.status = 204;
}