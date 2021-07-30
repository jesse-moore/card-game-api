import {
    ApolloError,
    AuthenticationError,
    UserInputError,
} from 'apollo-server';
import { GraphQLUpload } from 'graphql-upload';
import { ClaimVerifyResult } from '../cognito/validateJWT';
import { User } from '../mysql/entity';
import { createUser } from '../mysql/queries';
import { MutationResolvers, QueryResolvers } from './generated/graphql-types';
import { controller } from '../game';

const Query: QueryResolvers = {
    test: () => {
        return 'Hello World';
    },
    status: (_parent, _args, _context: { user: ClaimVerifyResult }, _info) => {
        console.log(controller.games);
        return 'Status';
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
        if (!user.isValid) throw new AuthenticationError('Invaild user');
        const { email, userName } = user;
        const newUser = await createUser({ email, id: userName });
        if (newUser instanceof User) {
            const { email } = newUser;
            return { email };
        }
        throw new UserInputError(JSON.stringify(newUser.errors));
    },
    newGame: async (
        _parent,
        args,
        _context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { playerId } = args;
        // const { user } = context;
        return controller.startNewGame(playerId);
    },
    startNewRound: async (
        _parent,
        args,
        _context: { user: ClaimVerifyResult },
        _info
    ) => {
        const { id, playerId } = args;
        // const { user } = context;
        return controller.startNewRound(id, playerId);
    },
    removeGame: async (
        _parent,
        args,
        _context: { user: ClaimVerifyResult },
        _info
    ) => {
        // const { user } = context;
        const { id, playerId } = args;
        controller.removeGame(id, playerId);
        return `Removed game: ${id}`;
    },
    gameAction: async (
        _parent,
        args,
        _context: { user: ClaimVerifyResult },
        _info
    ) => {
        // const { id, playerId, action } = args;
        // const { user } = context;
        return controller.action(args);
    },
};

export default { Query, Mutation, Upload: GraphQLUpload };
