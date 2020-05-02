const Game = require('./models/game');
const GameStatus = require('./models/game-status');
const cardData = require('./card-data.json');
const { shuffle } = require('./models/deck');

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
        } else if (result[0].status !== GameStatus.WAITING_FOR_PLAYERS) {
            ctx.status = 400;
            ctx.body = {
                message: 'Game has already been started'
            };
            return;
        } else {
            const gameFromDb = result[0];
            let patchBody = ctx.request.body;
            if(typeof ctx.request.body === 'string') {
                patchBody = JSON.parse(ctx.request.body);
            }
            const game = new Game({
                ...gameFromDb,
                ...patchBody
            })

            if(game.status === GameStatus.STARTING_GAME) {
                // Game initialization!
                console.log('STARTING GAME:', game.name);
                const indexArrayOfWhiteCards = Array.apply(null, {length: cardData.whiteCards.length}).map(Number.call, Number);
                const whiteDeck = shuffle(indexArrayOfWhiteCards);
                const indexArrayOfBlackCards = Array.apply(null, {length: cardData.blackCards.length}).map(Number.call, Number);
                const blackDeck = shuffle(indexArrayOfBlackCards);
                game.players.forEach(player => {
                    // Distribute 7 random cards to each player
                    console.log('White card deck length:', game.whiteCardDeck.length);
                    const playerHand = [];
                    for(let cardCounter = 0; cardCounter < 7; cardCounter++) {
                        const selectedCard = whiteDeck.shift();
                        console.log('Selected card:', selectedCard);
                        playerHand.push(selectedCard);
                    }
                    console.log('Distributed white cards:', player.name, player.cards);
                    player.cards = playerHand;
                });

                // Select a black card
                game.currentBlackCard = blackDeck.shift();
                console.log('Distributed black card:', game.currentBlackCard);

                game.whiteCardDeck = whiteDeck;
                game.blackCardDeck = blackDeck;

                // Player[0] is selected as card tsar
                game.players[0].isCardTsar = true;
                console.log('Elected tsar:', game.players[0].name);
                // status moves to PLAYING
                game.status = GameStatus.PLAYING;
                console.log('Setting game to playing status');
            }

            await collection.updateOne({
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