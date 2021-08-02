import { gql } from 'apollo-server';

export const typeDefs = gql`
    scalar Upload

    type Status {
        games: [String]!
    }

    enum Action {
        hit
        stand
    }

    type Card {
        suit: String!
        number: Int!
        faceCard: String
    }

    type Player {
        id: String!
        cards: [Card]!
        count: Int!
        status: Int!
        winLose: Int!
        cash: Int!
    }

    type GameStatus {
        id: String!
        dealer: Player!
        player: Player!
        isStarted: Boolean!
        isWaiting: Boolean!
        isFinished: Boolean!
        reshuffled: Boolean!
    }

    type User {
        id: ID!
        cash: Int!
    }

    type Query {
        test: String
        status: Status!
        getUser: User!
    }

    type Mutation {
        createUser: String
        newGame(playerId: String, bet: Int!): GameStatus!
        startNewRound(id: String!, playerId: String, bet: Int!): GameStatus!
        removeGame(id: String!, playerId: String): String
        gameAction(id: String!, playerId: String, action: String!): GameStatus!
        test: String
        restoreBalance(id: String!, playerId: String): Int!
    }
`;
