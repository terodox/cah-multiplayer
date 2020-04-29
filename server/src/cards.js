module.exports = async function cardsRoute(ctx) {
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    await collection.insert({ something: 'really simple' });
    ctx.body = await collection.find().toArray()
}