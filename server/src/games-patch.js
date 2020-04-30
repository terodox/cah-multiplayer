const Game = require('./models/game');
const GameStatus = require('./models/game-status');
const {
    selectRandomBlackCard,
    selectRandomWhiteCards,
} = require('./card-manager');

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
                console.log('STARTING GAME:', game.name);
                game.players.forEach(player => {
                    // Distribute 7 random cards to each player
                    console.log('Consumed white cards:', game.consumedWhiteCards);
                    player.cards = selectRandomWhiteCards(game.consumedWhiteCards, 7);
                    console.log('Distributed white cards:', player.name, player.cards);
                    // Mark all cards as consumed
                    game.consumedWhiteCards = [
                        ...game.consumedWhiteCards,
                        ...player.cards
                    ];
                });
                // Select a black card
                game.currentBlackCard = selectRandomBlackCard(game.consumedBlackCards);
                console.log('Distributed black card:', game.currentBlackCard);

                game.consumedWhiteCards = [
                    ...game.consumedWhiteCards,
                    game.currentBlackCard
                ];

                // Player[0] is selected as card tsar
                game.players[0].isCardTsar = true;
                console.log('elected tsar:', game.players[0].name);
                // status moves to PLAYING
                game.status = GameStatus.PLAYING;
                console.log('Setting game to playing status');
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