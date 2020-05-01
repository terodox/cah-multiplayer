import ac from 'argument-contracts';
import { coerceArray } from '@meltwater/coerce';
import { GameStatus } from './game-status';
import { Player } from './player';

export class Game {
    public name: string;
    public status: string;
    public players: Player;
    public whiteCardDeck: Array<number>;
    public blackCardDeck: Array<number>;
    public currentBlackCard: number;

    constructor({
        name,
        status = GameStatus.WAITING_FOR_PLAYERS,
        players = [],
        currentBlackCard = -1,
        whiteCardDeck = [],
        blackCardDeck = [],
    }) {
        ac.assertString(name, 'name');
        if(!GameStatus.isValid(status)) {
            throw new TypeError(`status must be a valid GameStatus. Provided value: ${status}`);
        }
        ac.assertNumber(currentBlackCard, 'currentBlackCard');
        ac.assertArrayOf(whiteCardDeck, Number, 'whiteCardDeck');
        ac.assertArrayOf(blackCardDeck, Number, 'blackCardDeck');

        this.name = name;
        this.status = status;
        this.players = coerceArray(players, Player, 'players should be an array of Player objects');
        this.whiteCardDeck = whiteCardDeck;
        this.blackCardDeck = blackCardDeck;
        this.currentBlackCard = currentBlackCard;
    }
}
