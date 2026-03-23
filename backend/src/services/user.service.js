// User management business logic

import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => await User.find().select('-password');

export const getUserById = async (id) => await User.findById(id).select('-password');

export const createUser = async (userData) => {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    return await User.create(userData);
};

export const updateUser = async (id, updateData) => {
    // Si l'utilisateur modifie son mot de passe, on doit le re-hacher
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // { new: true } permet de renvoyer le document modifié et non l'ancien
    return await User.findByIdAndUpdate(id, updateData, { 
        returnDocument: 'after',
        runValidators: true
    }).select('-password');
};

export const deleteUser = async (id) => await User.findByIdAndDelete(id);