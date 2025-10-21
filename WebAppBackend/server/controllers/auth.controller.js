import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Signup controller
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password are required' });
  try {
    // Check if either username OR email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ username: result.username, id: result._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(201).json({ result: { id: result._id, username: result.username, email: result.email }, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Login controller - allow username OR email
export const login = async (req, res) => {
  // Accept either { loginInput, password } or { username, password } for backward compatibility
  const { loginInput, username, email, password } = req.body;
  const identifier = loginInput || username || email;
  if (!identifier || !password) return res.status(400).json({ message: 'identifier (username/email) and password are required' });
  try {
    // Find by username OR email (case-insensitive)
    const existingUser = await User.findOne({ $or: [ { username: identifier }, { email: identifier } ] });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.status(200).json({ success: true, message: 'Login Successful', result: { id: existingUser._id, username: existingUser.username, email: existingUser.email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};