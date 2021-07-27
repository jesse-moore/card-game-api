import { validate, ValidationError } from 'class-validator';
import { getConnection } from './index';
import { User, Model } from './entity';
import { ModelValidationErrors, UserInterface } from '../types';
import { uuid } from 'aws-sdk/clients/customerprofiles';

const getUserByID = async (id: string) => {
    return await User.findOne({ where: { id } });
};

export const createUser = async (
    user: UserInterface
): Promise<User | { errors: ModelValidationErrors }> => {
    await getConnection();
    const newUser = new User(user.email, user.id);
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
