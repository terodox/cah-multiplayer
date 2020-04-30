const PlayerStatus = {
    PLAYING: 'PLAYING',
    CARD_TSAR: 'CARD_TSAR',
    isValid: (status) => {
        return PlayerStatus.hasOwnProperty(status);
    }
};

module.exports = PlayerStatus;