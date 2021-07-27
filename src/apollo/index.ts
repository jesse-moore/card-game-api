import { ApolloServer } from 'apollo-server-express';
import { schema } from '../graphql/schema';
import { validateJWT } from '../cognito';
import { ClaimVerifyResult } from '../cognito/validateJWT';

export const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }): Promise<{ user: ClaimVerifyResult }> => {
        const token = req.headers.authorization;
        const user = await validateJWT(token);
        return { user };
    },
    uploads: false,
});
