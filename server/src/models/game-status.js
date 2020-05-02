const GameStatus = {
    STARTING_GAME: 'STARTING_GAME',
    WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
    WAITING_FOR_CARDS: 'WAITING_FOR_CARDS',
    WAITING_FOR_TSAR_SELECTION: 'WAITING_FOR_TSAR_SELECTION',
    REVEALING_WINNING_CARD: 'REVEALING_WINNING_CARD',
    isValid: (status) => {
        return GameStatus.hasOwnProperty(status);
    }
};

module.exports = GameStatus;