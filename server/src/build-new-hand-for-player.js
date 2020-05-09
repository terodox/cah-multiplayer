module.exports = function buildNewHandForPlayer({ whiteDeck }) {
    console.log('White card deck length:', whiteDeck.length);
    const localCopyOfWhiteDeck = [ ...whiteDeck ];
    const playerHand = [];
    for(let cardCounter = 0; cardCounter < 7; cardCounter++) {
        const selectedCard = localCopyOfWhiteDeck.shift();
        console.log('Selected card:', selectedCard);
        playerHand.push(selectedCard);
    }
    return {
        playerHand,
        whiteDeck: localCopyOfWhiteDeck
    };
}