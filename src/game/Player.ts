import { Card } from './Card';

export class Player {
    id: string;
    cards: Card[];
    count: number;
    status: 0 | 1 | 2 | 3 | 4;
    // 0: playing, 1: played, 2: natural, 3: black jack, 4: bust
    constructor({ id }: { id: string }) {
        this.id = id;
        this.cards = [];
        this.count = 0;
        this.status = 0;
    }
    updateStatus() {
        let hasAce = false;
        this.count = this.cards.reduce((a, c) => {
            if (c.value === 11) hasAce = true;
            return a + c.value;
        }, 0);
        if (this.count > 21 && hasAce) this.count -= 10;
        if (this.cards.length === 2 && this.count === 21) {
            this.status = 2;
        } else if (this.count === 21) {
            this.status = 3;
        } else if (this.count > 21) {
            this.status = 4;
        }
    }
    addCard(cards: Card[]) {
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
    }
}
