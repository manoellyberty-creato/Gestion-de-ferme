import Animal from '../models/Animal.js';
import QRCode from 'qrcode';


export const getAll = async (req, res) => {
  try {
    // ON AJOUTE .populate('department') pour avoir le nom et les infos du secteur
    const animals = await Animal.find().populate('department').sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const animal = new Animal(req.body);
    
    // Génération du QR Code basé sur l'ID unique de MongoDB
    // On peut y mettre une URL vers la fiche de l'animal plus tard
    const qrDataURL = await QRCode.toDataURL(animal._id.toString());
    animal.qrCode = qrDataURL;

    const saved = await animal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await Animal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: "Animal supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};