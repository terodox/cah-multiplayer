const Game = require('./models/game');
const GameStatus = require('./models/game-status');

module.exports = async function gamesGet(ctx, gameId) {
    console.log('Posting tsar selection for game by id:', gameId);
    const collection = ctx.mongo.db('cah-multiplayer').collection('games');
    try {
        let result = await collection.find({ name: gameId }).toArray();
        console.log('Get result', result);

        if(result.length === 0) {
            ctx.status = 404;
            return;
        } else {
            const gameFromDb = result[0];
            let postBody = ctx.request.body;
            if(typeof ctx.request.body === 'string') {
                postBody = JSON.parse(ctx.request.body);
            }

            const game = new Game(gameFromDb);
            game.lastTsarSelection = postBody.cardId;
            const winningPlayer = game.players.find(player => player.selectedCard === postBody.cardId);
            winningPlayer.points++;
            game.lastWinnerPlayerIndex = game.players.indexOf(winningPlayer);
            game.status = GameStatus.REVEALING_WINNING_CARD;

            //Rotate card tsar
            const currentTsar = game.players.find(player => player.isCardTsar);
            const tsarIndex = game.players.indexOf(currentTsar);
            game.players.forEach(player => player.isCardTsar = false);
            if(tsarIndex + 1 >= game.players.length) {
                game.players[0].isCardTsar = true;
            } else {
                game.players[tsarIndex + 1].isCardTsar = true;
            }

            //Deal new cards to each player
            game.players.forEach(player => {
                if(player.selectedCard !== -1) {
                    const index = player.cards.indexOf(player.selectedCard);
                    if (index > -1) {
                        player.cards.splice(index, 1);
                    }
                    player.selectedCard = -1;
                }
                player.cards.push(game.whiteCardDeck.shift());
            });

            // Select new black card
            game.lastBlackCard = game.currentBlackCard;
            game.currentBlackCard = game.blackCardDeck.shift();

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