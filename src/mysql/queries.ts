import { validate, ValidationError } from 'class-validator';
import { getConnection } from './index';
import { User, Model } from './entity';
import { ModelValidationErrors, UserInterface } from '../types';
import { uuid } from 'aws-sdk/clients/customerprofiles';
import { ApolloError } from 'apollo-server-express';

export const getUserByID = async (id: string) => {
    return await User.findOne({ where: { id } });
};

export const getCash = async (id: string) => {
	console.log('GET CASH')
    await getConnection();
    const currentUser = await User.findOne(id);
    if (!currentUser) throw new ApolloError('User not found');
    return currentUser.cash;
};

export const createUser = async (user: {
    id: string;
    cash?: number;
}): Promise<User | { errors: ModelValidationErrors }> => {
    await getConnection();
    const newUser = new User(user.id, user.cash || 1000);
    const errors = await validateModel(newUser);
    if (errors) return { errors };
    const res = await newUser.save();
    return res;
};

const validateModel = async (
    model: Model
): Promise<ModelValidationErrors | null> => {
    const errors: ModelValidationErrors = {};
    const validations = await validate(model);
    if (!validations.length) return null;
    validations.forEach((error) => {
        errors[error.property] = { ...error.constraints };
    });
    return errors;
};

export const updateCash = async (user: { id: string; amount: number }) => {
    console.log('UPDATE CASH');
    const { id, amount } = user;
    await getConnection();
    const currentUser = await User.findOne(id);
    if (!currentUser) throw new ApolloError('User not found');
    currentUser.cash += amount;
    await currentUser.save();
};

export const setCash = async (id: string, amount: number) => {
    console.log('SET CASH');
    await getConnection();
    const currentUser = await User.findOne(id);
    if (!currentUser) throw new ApolloError('User not found');
    currentUser.cash = amount;
    await currentUser.save();
};
