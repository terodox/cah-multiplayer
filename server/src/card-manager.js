const cardData = require('./card-data.json');

function findRelativeCompliment(allCards, alreadyUsedCards) {
    if(alreadyUsedCards.length === 0) {
        return allCards;
    }
    return allCards.filter(card => alreadyUsedCards.find(usedCard => usedCard === card));
}

module.exports = {
    selectRandomWhiteCards: (alreadyUsedCards, howManyToSelect) => {
        console.log('alreadyUsedCards:', alreadyUsedCards);
        const allCards = Array.apply(null, {length: cardData.whiteCards.length}).map(Number.call, Number);
        console.log('all cards:', allCards);
        const remainingCards = findRelativeCompliment(allCards, alreadyUsedCards);
        console.log('remainingCards:', remainingCards);
        if(remainingCards < howManyToSelect) {
            throw new Error('No more cards to select!!!');
        }

        const selectedCards = [];
        while(selectedCards.length < howManyToSelect) {
            const randomIndex = Math.floor((Math.random() * remainingCards.length) + 1);
            console.log('trying to select:', remainingCards[randomIndex]);
            if(remainingCards[randomIndex] && !selectedCards.includes(remainingCards[randomIndex])) {
                selectedCards.push(remainingCards[randomIndex]);
            }
        }
        return selectedCards;
    },
    selectRandomBlackCard: (alreadyUsedCards) => {
        const allCards = Array.apply(null, {length: cardData.blackCards.length}).map(Number.call, Number);
        const remainingCards = findRelativeCompliment(alreadyUsedCards, allCards);
        const randomIndex = Math.floor((Math.random() * remainingCards.length) + 1);
        return remainingCards[randomIndex];
    },
};