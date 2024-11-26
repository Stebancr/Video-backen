import bcrypt from "bcrypt";
import User from "../models/user.js";

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email: email });
    if (!user.length) {
      return res.status(401).json({ error: 'El usuario no existe' });
    }
    const userData = user[0];
    const passValid = await bcrypt.compare(password, userData.password);
    if (!passValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    return res.json(userData);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const viewUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al filtrar usuarios:", error);
    throw new Error("Error al filtrar usuarios");
  }
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.find({ email: email });
    if (userExists.length) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const user = new User({ name, email, password });
    const newUser = await user.save();
    return res.status(201).json({ message: `Nuevo usuario agregado con éxito.`, data: newUser });
  } catch (error) {
    console.error('Error al agregar el nuevo usuario:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
