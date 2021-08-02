import { ICard } from './Card';

export class Player {
    id: string;
    cards: ICard[];
    count: number;
    // 0: playing, 1: played, 2: natural, 3: black jack, 4: bust
    status: 0 | 1 | 2 | 3 | 4;
    winLose: number;
    cash: number;
    constructor({ id, cash = 0 }: { id: string; cash: number }) {
        this.id = id;
        this.cards = [];
        this.count = 0;
        this.status = 0;
        this.winLose = 0;
        this.cash = cash;
    }
    updateStatus() {
        let aces = 0;
        this.count = this.cards.reduce((a, c) => {
            if (c.number === 11) aces++;
            return a + c.number;
        }, 0);
        if (this.count > 21 && aces > 0) {
            while (this.count > 21 && aces > 0) {
                this.count -= 10;
                aces--;
            }
        }
        if (this.cards.length === 2 && this.count === 21) {
            this.status = 2;
        } else if (this.count === 21) {
            this.status = 3;
        } else if (this.count > 21) {
            this.status = 4;
        }
    }
    addCard(cards: ICard[]) {
        this.cards = [...this.cards, ...cards];
        this.updateStatus();
    }
    getStatus() {
        return {
            cards: this.cards,
            count: this.count,
            status: this.status,
            id: this.id,
        };
    }
    reset() {
        this.cards = [];
        this.count = 0;
        this.status = 0;
        this.winLose = 0;
    }
}
