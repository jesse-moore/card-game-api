import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLUpload } from 'graphql-upload';
import { ClaimVerifyResult } from '../cognito/validateJWT';
import { User } from '../mysql/entity';
import { createUser, getUserByID, setCash } from '../mysql/queries';
import { MutationResolvers, QueryResolvers } from './generated/graphql-types';
import { controller } from '../game';
import { nanoid } from 'nanoid';

const Query: QueryResolvers = {
    status: (_parent, _args, _context: { user: ClaimVerifyResult }, _info) => {
        const keys = Object.keys(controller.games);
        return { games: keys };
    },
    getUser: async (
        _parent,
        _args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { user } = context;
        if (!user.isValid) return { id: nanoid(), cash: 1000 };
        const userByID = await getUserByID(user.userName);
        if (!userByID) throw new AuthenticationError('User not found');
        return userByID;
    },
};

const Mutation: MutationResolvers = {
    createUser: async (
        _parent,
        _args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { user } = context;
        if (!user.isValid)
            throw new AuthenticationError('Create User: Invalid user');
        const { userName } = user;
        const newUser = await createUser({ id: userName });
        if (newUser instanceof User) {
            const { id } = newUser;
            return id;
        }
        throw new UserInputError(JSON.stringify(newUser.errors));
    },
    newGame: async (
        _parent,
        args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { bet, playerId } = args;
        const { user } = context;
        const isGuest = !user.isValid;
        const pId = user.isValid ? user.userName : playerId;
        if (!pId) throw new AuthenticationError('New Game: Invalid user');
        return controller.startNewGame(bet, pId, isGuest);
    },
    startNewRound: async (
        _parent,
        args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { id, bet, playerId } = args;
        const { user } = context;
        const isGuest = !user.isValid;
        const pId = isGuest ? playerId : user.userName;
        if (!pId)
            throw new AuthenticationError('Start New Round: Invalid user');
        return controller.startNewRound(id, pId, bet, isGuest);
    },
    removeGame: async (
        _parent,
        args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { id, playerId } = args;
        const { user } = context;
        const pId = user.isValid ? user.userName : playerId;
        if (!pId) throw new AuthenticationError('Remove Game: Invalid user');
        controller.removeGame(id, pId);
        return `Removed game: ${id}`;
    },
    gameAction: async (
        _parent,
        args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { id, action, playerId } = args;
        const { user } = context;
        const isGuest = !user.isValid;
        const pId = isGuest ? playerId : user.userName;
        if (!pId) throw new AuthenticationError('Action: Invalid user');
        return controller.action({ id, action, playerId: pId, isGuest });
    },
    restoreBalance: async (
        _parent,
        args,
        context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { id, playerId } = args;
        const { user } = context;
        const isGuest = !user.isValid;
        const pId = isGuest && playerId ? playerId : user.userName;
        if (!id) throw new AuthenticationError('Restore Balance: Invalid user');
        if (!isGuest) await setCash(user.userName, 1000);
        controller.restoreBalance(id, 1000);
        return 1000;
    },
};

export default { Query, Mutation, Upload: GraphQLUpload };
