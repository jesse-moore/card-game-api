import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { GameStatus } from '../graphql/generated/graphql-types';
import { getCash, updateCash } from '../mysql/queries';
import { Game } from './Game';
import { Player } from './Player';

export class Controller {
    games: { [key: string]: Game };
    constructor() {
        this.games = {};
    }

    async startNewGame(
        bet: number,
        id: string,
        isGuest: boolean
    ): Promise<GameStatus> {
        try {
            const cash = isGuest ? 1000 : await getCash(id);
            const playerId = id;
            const player = new Player({ id: playerId, cash });
            const newGame = new Game(player);
            this.games[newGame.id] = newGame;
            newGame.startGame(bet);
            const game = this.getGame(newGame.id);
            await this.updateCash({ game, playerId, bet, isGuest });
            return game.getGameStatus();
        } catch (error) {
            throw new UserInputError(error);
        }
    }
    async startNewRound(
        id: string,
        playerId: string, 
        bet: number,
        isGuest: boolean
    ) {
        const game = this.getGame(id);
        const player = game.getPlayer();
        if (player.id !== playerId) {
            throw new ForbiddenError(
                `Not authorized to start new round on game ${id}`
            );
        }

        game.startNextRound(bet);
        await this.updateCash({ game, playerId, bet, isGuest });
        return game.getGameStatus();
    }
    getGame(id: string) {
        if (!id) throw new UserInputError(`Game id required`);
        const game = this.games[id];
        if (!game) throw new UserInputError(`Game ${id} does not exist`);
        return this.games[id];
    }
    removeGame(id: string, playerId: string) {
        const game = this.getGame(id);
        const player = game.getPlayer();
        if (player.id !== playerId)
            throw new ForbiddenError(`Not authorized to remove game ${id}`);
        delete this.games[id];
    }
    async action(args: {
        id: string;
        playerId: string;
        action: string;
        isGuest: boolean;
    }) {
        const { id, playerId, action, isGuest } = args;
        const game = this.getGame(id);
        const player = game.getPlayer();
        if (player.id !== playerId)
            throw new ForbiddenError(`Not authorized on game ${id}`);
        try {
            game.action({ action });
            await this.updateCash({ game, playerId, bet: game.bet, isGuest });
            return game.getGameStatus();
        } catch (error) {
            throw new UserInputError(error);
        }
    }
    async updateCash(args: {
        game: Game;
        playerId: string;
        bet: number;
        isGuest: boolean;
    }) {
        const { game, playerId, bet, isGuest } = args;
        const player = game.getPlayer();
        if (player.id !== playerId)
            throw new ForbiddenError(`Not authorized on game ${game.id}`);
        try {
            const winLose = game.player.winLose;
            if (game.isFinished && winLose !== 3) {
                const amount = winLose === 1 ? bet * -1 : bet;
                game.player.cash += amount;
                if (!isGuest) await updateCash({ id: playerId, amount });
            }
            return game.getGameStatus();
        } catch (error) {
            throw new UserInputError(error);
        }
    }
    async restoreBalance(id: string, amount: number) {
        const game = this.getGame(id);
        game.player.cash = amount;
    }
    cleanupGames() {
        const keys = Object.keys(this.games);
        keys.forEach((key) => {
            const current = new Date().valueOf();
            if (current - this.games[key].lastUpdate.valueOf() > 1800000) {
                delete this.games[key];
            }
        });
    }
}
