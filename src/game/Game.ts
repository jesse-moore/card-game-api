import { nanoid } from 'nanoid';
import { Card } from './Card';
import { Player } from './Player';

interface GameStatus {
    dealer: Player;
    player: Player;
    isStarted: boolean;
    isWaiting: boolean;
    isFinished: boolean;
}

export class Game {
    id: string;
    numberOfDecks: number;
    isStarted: boolean;
    isWaiting: boolean;
    isFinished: boolean;
    dealer: Player;
    player: Player;
    shoe: Card[];
    spentCards: Card[];
    reshuffleLimit: number;
    reshuffleCount: number;
    constructor({ playerId }: { playerId: string }) {
        this.id = nanoid();
        this.numberOfDecks = 1;
        this.dealer = new Player({ id: 'dealer' });
        this.player = new Player({ id: playerId });
        this.shoe = [];
        this.spentCards = [];
        this.reshuffleLimit = 0.75;
        this.reshuffleCount = this.numberOfDecks * this.reshuffleLimit * 52;
        this.isStarted = false;
        this.isWaiting = false;
        this.isFinished = false;
        this.buildGame();
    }
    buildGame() {
        this.shoe = this.buildDeck();
        this.shuffleDeck();
    }
    buildDeck() {
        const deck = [];
        const suits = ['Clubs', 'Spades', 'Diamonds', 'Hearts'];
        for (let i = 0; i < this.numberOfDecks; i++) {
            for (var suit of suits) {
                for (let value = 2; value < 11; value++) {
                    deck.push(new Card({ suit, value, symbol: String(value) }));
                }
                for (let symbol of ['J', 'Q', 'K']) {
                    deck.push(new Card({ suit, value: 10, symbol }));
                }
                deck.push(new Card({ suit, value: 11, symbol: 'A' }));
            }
        }
        return deck;
    }
    shuffleDeck() {
        for (var i = this.shoe.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.shoe[i];
            this.shoe[i] = this.shoe[j];
            this.shoe[j] = temp;
        }
    }
    getDealer(options: { hideSecondCard?: boolean } = {}) {
        const { hideSecondCard = false } = options;
        if (hideSecondCard) {
            return {
                status: this.dealer.status,
                cards: [this.dealer.cards[0]],
                count: this.dealer.cards[0].value,
                id: this.dealer.id,
            };
        } else {
            return {
                status: this.dealer.status,
                cards: this.dealer.cards,
                count: this.dealer.count,
                id: this.dealer.id,
            };
        }
    }
    getPlayer() {
        return {
            status: this.player.status,
            cards: this.player.cards,
            count: this.player.count,
            id: this.player.id,
        };
    }
    startNextRound() {
        if (!this.isFinished) throw new Error('Game not finished');
        this.player.reset();
        this.dealer.reset();
        return this.startRound();
    }
    startGame() {
        if (this.isStarted) throw new Error('Game already started');
        this.isStarted = true;
        return this.startRound();
    }
    startRound() {
        this.player.addCard(this.dealCard(2));
        this.dealer.addCard(this.dealCard(2));
        this.isFinished = false;
        this.isWaiting = true;
        this.updateGameStatus();
        return this.getGameStatus();
    }
    updateGameStatus() {
        const dealer = this.dealer;
        const player = this.player;
        if (player.status > 1 || dealer.status > 1) this.stand();
    }
    getGameStatus() {
        const status = {
            id: this.id,
            player: this.getPlayer(),
            isStarted: this.isStarted,
            isWaiting: this.isWaiting,
            isFinished: this.isFinished,
            dealer: this.getDealer({ hideSecondCard: true }),
        };
        if (this.player.status > 0 || this.isFinished) {
            status.dealer = this.getDealer();
        }
        return status;
    }
    dealCard(cards: number) {
        const deal = [];
        for (let i = 0; i < cards; i++) {
            const card = this.shoe.pop();
            if (!card) continue;
            deal.push(card);
            this.spentCards.push(card);
        }
        return deal;
    }
    action({ action }: { action: string }) {
        if (!this.isWaiting || this.isFinished)
            throw new Error('Cannot perform this action');
        const player = this.player;
        switch (action) {
            case 'hit':
                this.hit(player);
                break;
            case 'stand':
                this.player.status = 1;
                this.stand();
                break;
            default:
        }
        this.updateGameStatus();
        return this.getGameStatus();
    }
    hit(player: Player) {
        if (player.count > 20) return;
        player.addCard(this.dealCard(1));
    }
    stand() {
        this.isWaiting = false;
        if (this.player.status === 1 || this.player.status === 3) {
            while (this.dealer.count < 17) {
                this.hit(this.dealer);
            }
        }
        if (this.dealer.count < 21) this.dealer.status = 1;
        this.endRound();
    }
    endRound() {
        this.isFinished = true;
        if (this.spentCards.length >= this.reshuffleCount) {
            this.shoe = [...this.shoe, ...this.spentCards];
            this.spentCards = [];
            this.shuffleDeck();
        }
    }
}
