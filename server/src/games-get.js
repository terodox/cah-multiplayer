const Game = require('./models/game');

module.exports = async function gamesGet(ctx, gameId) {
    console.log('Getting game by id:', gameId);
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    try {
        let result = await collection.find({ name: gameId }).toArray();
        console.log('Get result', result);

        let game;
        if(result.length > 0) {
            console.log('Found game!');
            game = new Game(result[0]);
        } else {
            console.log('Creating new game!');
            game = new Game({
                name: gameId
            })
            await collection.insertOne(game);
            // The mongo driver adds fields we don't want exposed.... So re-encapsulate to prevent that
            game = new Game(game);
        }
        ctx.body = game;
        ctx.status = 200;
    } catch(error) {
        console.error(error);
        ctx.status = 500;
    }
}