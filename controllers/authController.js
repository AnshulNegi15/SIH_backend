//authController.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Sign up function
const signup = async (req, res) => {
  const { full_name, email, password, inspector_id, dob, gender, government_id, employee_id, username } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { data, error } = await supabase
      .from('users') // Ensure the 'users' table is created in Supabase
      .insert([
        {
          full_name,
          email,
          password: hashedPassword,
          inspector_id,
          dob,
          gender,
          government_id,
          employee_id,
          username,
        },
      ]);

    if (error) {
      throw error;
    }

    const token = generateToken(data[0].id); // Generate token for the newly registered user
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign in function
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single(); // Fetch user by email

    if (error || !data) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = generateToken(data.id); // Generate token
    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, signin };
