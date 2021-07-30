import { gql } from 'apollo-server';

export const typeDefs = gql`
    scalar Upload

    enum Action {
        hit
        stand
    }

    type Card {
        suit: String!
        value: Int!
        symbol: String!
    }

    type Player {
        id: String!
        cards: [Card]!
        count: Int!
        status: Int!
    }

    type GameStatus {
        id: String!
        dealer: Player!
        player: Player!
        isStarted: Boolean!
        isWaiting: Boolean!
        isFinished: Boolean!
    }

    type User {
        id: ID
        email: String!
    }

    type Query {
        test: String
        status(id: String): String
    }

    type Mutation {
        createUser: User
        newGame(playerId: String!): GameStatus!
        startNewRound(id: String!, playerId: String!): GameStatus!
        removeGame(id: String!, playerId: String!): String
        gameAction(id: String!, playerId: String!, action: Action!): GameStatus!
        test: String
    }
    type Subscription {
        test: String
    }
`;
