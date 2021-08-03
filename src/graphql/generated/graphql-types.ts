import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum Action {
  Hit = 'hit',
  Stand = 'stand'
}

export type Card = {
  __typename?: 'Card';
  suit: Scalars['String'];
  number: Scalars['Int'];
  faceCard?: Maybe<Scalars['String']>;
};

export type GameStatus = {
  __typename?: 'GameStatus';
  id: Scalars['String'];
  dealer: Player;
  player: Player;
  isStarted: Scalars['Boolean'];
  isWaiting: Scalars['Boolean'];
  isFinished: Scalars['Boolean'];
  reshuffled: Scalars['Boolean'];
  bet: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<Scalars['String']>;
  newGame: GameStatus;
  startNewRound: GameStatus;
  removeGame?: Maybe<Scalars['String']>;
  gameAction: GameStatus;
  restoreBalance: Scalars['Int'];
};


export type MutationNewGameArgs = {
  playerId?: Maybe<Scalars['String']>;
  bet: Scalars['Int'];
};


export type MutationStartNewRoundArgs = {
  id: Scalars['String'];
  playerId?: Maybe<Scalars['String']>;
  bet: Scalars['Int'];
};


export type MutationRemoveGameArgs = {
  id: Scalars['String'];
  playerId?: Maybe<Scalars['String']>;
};


export type MutationGameActionArgs = {
  id: Scalars['String'];
  playerId?: Maybe<Scalars['String']>;
  action: Scalars['String'];
};


export type MutationRestoreBalanceArgs = {
  id: Scalars['String'];
  playerId?: Maybe<Scalars['String']>;
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['String'];
  cards: Array<Card>;
  count: Scalars['Int'];
  status: Scalars['Int'];
  winLose: Scalars['Int'];
  cash: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  status: Status;
  getUser: User;
};

export type Status = {
  __typename?: 'Status';
  games: Array<Maybe<Scalars['String']>>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  cash: Scalars['Int'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Action: Action;
  Card: ResolverTypeWrapper<Card>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  GameStatus: ResolverTypeWrapper<GameStatus>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  Query: ResolverTypeWrapper<{}>;
  Status: ResolverTypeWrapper<Status>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Card: Card;
  String: Scalars['String'];
  Int: Scalars['Int'];
  GameStatus: GameStatus;
  Boolean: Scalars['Boolean'];
  Mutation: {};
  Player: Player;
  Query: {};
  Status: Status;
  Upload: Scalars['Upload'];
  User: User;
  ID: Scalars['ID'];
};

export type CardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = {
  suit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  faceCard?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameStatus'] = ResolversParentTypes['GameStatus']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dealer?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  isStarted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isWaiting?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isFinished?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reshuffled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  bet?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newGame?: Resolver<ResolversTypes['GameStatus'], ParentType, ContextType, RequireFields<MutationNewGameArgs, 'bet'>>;
  startNewRound?: Resolver<ResolversTypes['GameStatus'], ParentType, ContextType, RequireFields<MutationStartNewRoundArgs, 'id' | 'bet'>>;
  removeGame?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationRemoveGameArgs, 'id'>>;
  gameAction?: Resolver<ResolversTypes['GameStatus'], ParentType, ContextType, RequireFields<MutationGameActionArgs, 'id' | 'action'>>;
  restoreBalance?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationRestoreBalanceArgs, 'id'>>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  winLose?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cash?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  games?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cash?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Card?: CardResolvers<ContextType>;
  GameStatus?: GameStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
