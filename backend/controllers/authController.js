import { sql } from "../db/db.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Please fill in the required fields.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Password must match confirmed password.",
    });
  }

  const validEmail = validator.isEmail(`${email}`);
  if (!validEmail) {
    return res.status(400).json({
      error: "Please enter a valid email.",
    });
  }

  const validPassword = validator.isStrongPassword(`${password}`);
  if (!validPassword) {
    return res.status(400).json({
      error: "Password not strong enough. Please make sure your password:",
      requirements: [
        "- Is at least 8 characters long",
        "- Uses upper and lowercase letters",
        "- Uses at least one character, ex. '@', '!'...",
      ],
    });
  }

  try {
    // Checking if user already exists
    const existingUser = await sql`
      SELECT email FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: "User already exists.",
      });
    }

    // Hashing the password
    const hash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hash})
    `;

    return res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Please fill in the required fields.",
    });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  try {
    const existingUser = await sql`SELECT * FROM users where email = ${email}`;

    if (existingUser.length === 0) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

    const user = existingUser[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: "Incorrect email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("Token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in: ", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
}

// TODO: Logout function
