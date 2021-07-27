import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLUpload } from 'graphql-upload';
import { ClaimVerifyResult } from '../cognito/validateJWT';
import { User } from '../mysql/entity';
import { createUser } from '../mysql/queries';
import { MutationResolvers, QueryResolvers } from './generated/graphql-types';

const Query: QueryResolvers = {
    test: () => {
        return 'Hello World';
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
};

export default { Query, Mutation, Upload: GraphQLUpload };
