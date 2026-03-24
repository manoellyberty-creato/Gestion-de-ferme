// User management controller (CRUD)

import * as userService from '../services/user.service.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajoute ici editUser de la même manière...

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedUser = await userService.updateUser(id, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(updatedUser);
    } catch (error) {
        // Si l'email est déjà pris par un autre user, MongoDB renverra une erreur
        if (error.code === 11000) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        res.status(500).json({ message: error.message });
    }
};