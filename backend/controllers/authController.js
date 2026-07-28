import { sql } from "../db/db.js";
import bcrypt from "bcrypt";
import validator from "validator";

const saltRounds = 10;

export async function registerUser(req, res) {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Email, password and confirm password are required fields."
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Password must match confirmed password."
    });
  }

  const validEmail = validator.isEmail(`${email}`);
  if (!validEmail) {
    return res.status(400).json({
      error: "Please enter a valid email."
    });
  }

  const validPassword = validator.isStrongPassword(`${password}`)
  if (!validPassword) {
    return res.status(400).json({
      error: "Password not strong enough. Please make sure your password:",
      requirements: [
        "- Is at least 8 characters long",
        "- Uses upper and lowercase letters",
        "- Uses at least one character, ex. '@', '!'..."
      ]
    });
  }

  try {
    // Checking if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "User already exists."
      });
    }

    // Hashing the password
    const hash = await bcrypt.hash(password, saltRounds);

    await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hash})
    `;

    return res.status(201).json({
      message: "Registration successful!"
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again later."
    })
  }

}
