import ac from 'argument-contracts';
import { PlayerStatus } from './player-status';

const NONE = -1;
export class Player {
    public name: string;
    public points: number;
    public cards: Array<number>;
    public status: string;
    public selectedCard: number;
    public isCardTsar: boolean;

    constructor({
        name,
        points = 0,
        cards = [],
        selectedCard = NONE,
        status = PlayerStatus.PLAYING,
        isCardTsar = false,
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');
        ac.assertNumber(selectedCard, 'selectedCard');
        ac.assertArrayOf(cards, Number, 'cards');
        ac.assertBoolean(isCardTsar, 'isCardTsar');
        if(!PlayerStatus.isValid(status)) {
            throw new TypeError(`status must be a valid PlayerStatus. Provided value: ${status}`);
        }

        this.name = name;
        this.points = points;
        this.cards = cards;
        this.status = status;
        this.selectedCard = selectedCard;
        this.isCardTsar = isCardTsar;
    }
};
