import { gql } from 'apollo-server';

export const typeDefs = gql`
    scalar Upload
    
	type User {
        id: ID
        email: String!
    }

    type Query {
        test: String
    }

    type Mutation {
        createUser: User
        test: String
    }
`;
