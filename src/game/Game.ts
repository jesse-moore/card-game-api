import { nanoid } from 'nanoid';
import { Card, ICard } from './Card';
import { Player } from './Player';

export class Game {
    id: string;
    numberOfDecks: number;
    isStarted: boolean;
    isWaiting: boolean;
    isFinished: boolean;
    dealer: Player;
    player: Player;
    bet: number;
    shoe: ICard[];
    spentCards: ICard[];
    reshuffled: boolean;
    reshuffleLimit: number;
    reshuffleCount: number;
    lastUpdate: Date;
    constructor(player: Player) {
        this.id = nanoid();
        this.numberOfDecks = 1;
        this.dealer = new Player({ id: 'dealer', cash: 0 });
        this.player = player;
        this.shoe = [];
        this.spentCards = [];
        this.reshuffleLimit = 0.75;
        this.reshuffleCount = this.numberOfDecks * this.reshuffleLimit * 52;
        this.isStarted = false;
        this.isWaiting = false;
        this.isFinished = false;
        this.bet = 0;
        this.reshuffled = false;
        this.lastUpdate = new Date();
        this.buildGame();
    }
    buildGame() {
        this.shoe = this.buildDeck();
        this.shuffleDeck();
    }
    buildDeck() {
        const deck = [];
        const suits = ['club', 'spade', 'diamond', 'heart'];
        for (let i = 0; i < this.numberOfDecks; i++) {
            for (var suit of suits) {
                for (let i = 2; i < 11; i++) {
                    const number = i;
                    deck.push(new Card({ suit, number }));
                }
                for (let face of ['jack', 'queen', 'king']) {
                    const faceCard = face;
                    deck.push(new Card({ suit, faceCard, number: 10 }));
                }
                const faceCard = 'ace';
                deck.push(new Card({ suit, faceCard, number: 11 }));
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
                ...this.dealer,
                cards: [this.dealer.cards[0]],
                count: this.dealer.cards[0].number,
            };
        } else {
            return this.dealer;
        }
    }
    getPlayer() {
        return {
            ...this.player,
            status: this.player.status,
            cards: this.player.cards,
            count: this.player.count,
            id: this.player.id,
        };
    }
    startNextRound(bet: number) {
        if (!this.isFinished) throw new Error('Game not finished');
        this.bet = bet;
        this.player.reset();
        this.dealer.reset();
        return this.startRound();
    }
    startGame(bet: number) {
        if (this.isStarted) throw new Error('Game already started');
        this.bet = bet;
        this.isStarted = true;
        return this.startRound();
    }
    startRound() {
        this.lastUpdate = new Date();
        this.player.addCard(this.dealCard(2));
        this.dealer.addCard(this.dealCard(2));
        this.isFinished = false;
        this.isWaiting = true;
        this.reshuffled = false;
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
            reshuffled: this.reshuffled,
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
        this.lastUpdate = new Date();
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
            this.reshuffled = true;
        }
        this.checkGameResult();
    }
    checkGameResult() {
        const { player, dealer } = this;
        if (player.status === 4) {
            this.player.winLose = 1;
        } else if (dealer.status === 4) {
            this.player.winLose = 2;
        } else if (dealer.count > player.count) {
            this.player.winLose = 1;
        } else if (dealer.count === player.count) {
            this.player.winLose = 3;
        } else {
            this.player.winLose = 2;
        }
    }
}
