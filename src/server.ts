import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { apolloServer } from './apollo';
import { getConnection } from './mysql';
import { config } from './config';
import { controller } from './game';
require('./game');

async function startApolloServer() {
    await apolloServer.start();
    const connection = await getConnection();
    const app = express();
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    apolloServer.applyMiddleware({ app });

    app.listen({ port: config.SERVER_PORT });
    if (connection.isConnected) {
        console.log('Connected to DB');
    } else {
        console.log('Failed to connect to DB');
    }
    console.log(
        `🚀 Server ready at http://localhost:${config.SERVER_PORT}${apolloServer.graphqlPath}`
    );
    return { apolloServer, app };
}

setInterval(() => controller.cleanupGames(), 90000);

startApolloServer();
