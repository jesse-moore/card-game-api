interface ICard {
    suit: string;
    value: number;
    symbol: string;
}

export class Card {
    suit: string;
    value: number;
    symbol: string;
    constructor({ suit, value, symbol }: ICard) {
        this.suit = suit;
        this.value = value;
        this.symbol = symbol;
    }
}
