const GameStatus = {
    WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
    GAME_STARTED: 'GAME_STARTED',
    isValid: (status) => {
        return GameStatus.hasOwnProperty(status);
    }
};

module.exports = GameStatus;