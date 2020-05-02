import ac from 'argument-contracts';

export const NONE = -1;
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
        isCardTsar = false,
    }) {
        ac.assertString(name, 'name');
        ac.assertNumber(points, 'points');
        ac.assertNumber(selectedCard, 'selectedCard');
        ac.assertArrayOf(cards, Number, 'cards');
        ac.assertBoolean(isCardTsar, 'isCardTsar');

        this.name = name;
        this.points = points;
        this.cards = cards;
        this.selectedCard = selectedCard;
        this.isCardTsar = isCardTsar;
    }
};
