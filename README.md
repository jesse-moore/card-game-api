# blackjack-api

## About

This is a graphql api for a blackjack game. It will create a game and perform all the game actions and update the front end with the current game status.

## Technologies

[![Typescript][typescript-badge]][typescript-url]
[![Apollo GraphQL][apollo-graphql-badge]][apollo-graphql-url]
[![MySQL][mysql-badge]][mysql-url]
[![AWS][aws-badge]][aws-url]

### Deploy

#### Install node_modules

```
npm i
```

#### Setup .env files

```
Server Config
SERVER_PORT=

DB Config
DB_DATABASE=
DB_HOST=
DB_PORT=
DB_PASSWORD=
DB_USERNAME=

AWS Cognito config
COGNITO_POOL_ID=
AWS_REGION=
```

#### Start Application

Start typescript compiler `npm run tsc-watch`

Start dev server `npm run server-watch`

Generate graphql types `npm run codegen`

Compile to Javascript `npm run build`

Start production server `npm run start`

Deploy to your favorite host

#### Created by

Jesse Moore
| [LinkedIn](https://www.linkedin.com/in/jesse-moore-00804030/)
| [Github](https://github.com/jesse-moore)

[typescript-url]: https://www.typescriptlang.org
[typescript-badge]: https://img.shields.io/badge/TypeScript-222222?style=flat-square&logo=typescript
[apollo-graphql-url]: https://www.apollographql.com/
[apollo-graphql-badge]: https://img.shields.io/badge/Apollo%20GraphQL-222222?style=flat-square&logo=apollographql
[mysql-url]: https://www.mysql.com/
[mysql-badge]: https://img.shields.io/badge/MySQL-eeeeee?style=flat-square&logo=mysql
[aws-url]: https://aws.amazon.com/
[aws-badge]: https://img.shields.io/badge/Amazon%20AWS-black?style=flat-square&logo=amazonaws
