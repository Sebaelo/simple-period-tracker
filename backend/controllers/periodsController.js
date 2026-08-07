import { sql } from "../db/db.js";

export async function createPeriod(req, res) {
  if (!req.body?.start_date) {
    return res.status(400).json({
      error: "Please enter a start date.",
    });
  }

  try {
    const newPeriod = await sql`
      INSERT INTO periods (user_id, start_date, end_date)
      VALUES (${req.userId}, ${req.body.start_date}, ${req.body.end_date})
      RETURNING *
      `;
    return res.status(201).json({
      message: "Successfully added entry!",
    });
  } catch (error) {
    console.error("Error adding period entry: ", error);
    return res.status(500).json({
      error: "Something went wrong when adding your entry. Please try again.",
    });
  }
}
