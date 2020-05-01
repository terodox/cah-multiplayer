export const PlayerStatus = {
    PLAYING: 'PLAYING',
    CARD_TSAR: 'CARD_TSAR',
    isValid: (status) => {
        return PlayerStatus.hasOwnProperty(status);
    }
};
