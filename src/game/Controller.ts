import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { GameStatus } from '../graphql/generated/graphql-types';
import { Game } from './Game';

export class Controller {
    games: { [key: string]: Game };
    constructor() {
        this.games = {};
    }

    startNewGame(playerId: string): GameStatus {
        try {
            const newGame = new Game({ playerId });
            this.games[newGame.id] = newGame;
            return newGame.startGame();
        } catch (error) {
            throw new UserInputError(error);
        }
    }
    startNewRound(id: string, playerId: string) {
        const game = this.getGame(id);
        const player = game.getPlayer();
        if (player.id !== playerId) {
            throw new ForbiddenError(
                `Not authorized to start new round on game ${id}`
            );
        }
        return game.startNextRound();
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
    action(args: { id: string; playerId: string; action: string }) {
        const { id, playerId, action } = args;
        const game = this.getGame(id);
        const player = game.getPlayer();
        if (player.id !== playerId)
            throw new ForbiddenError(`Not authorized on game ${id}`);
        try {
            return game.action({ action });
        } catch (error) {
            throw new UserInputError(error);
        }
    }
}
