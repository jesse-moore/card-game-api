export type ICard = {
    suit: string;
    number: number;
    faceCard?: string;
};

export interface Suit {
    suit: 'club' | 'diamond' | 'spade' | 'heart';
}

export interface Face {
    faceCard: 'king' | 'queen' | 'jack' | 'ace';
}

export class Card {
    number: number;
    suit: string;
    faceCard: string | undefined;
    constructor({ number, suit, faceCard }: ICard) {
        this.number = number;
        this.suit = suit;
        this.faceCard = faceCard;
    }
}
