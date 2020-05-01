export const GameStatus = {
    PLAYING: 'PLAYING',
    STARTING_GAME: 'STARTING_GAME',
    WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
    isValid: (status) => {
        return GameStatus.hasOwnProperty(status);
    }
};
