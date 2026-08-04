import { sql } from "../db/db.js";

export async function createPeriod(req, res) {
  return res.status(200).json({
    message: "Hello from createPeriod",
  });
}
