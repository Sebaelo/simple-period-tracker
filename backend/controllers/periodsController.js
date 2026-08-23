import { sql } from "../db/db.js";
import { periodCalculations } from "../utils/calculations.js";

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
      RETURNING
        start_date::text AS start_date,
        end_date::text AS end_date,
        user_id,
        id
      `;

    return res.status(201).json({
      message: "Successfully added entry!",
      newPeriod,
    });
  } catch (error) {
    console.error("Error adding entry: ", error);
    return res.status(500).json({
      error: "Something went wrong when adding your entry. Please try again.",
    });
  }
}

export async function getPeriods(req, res) {
  try {
    const periods = await sql`SELECT
                  start_date::text AS start_date,
                  end_date::text AS end_date,
                  user_id,
                  id
                FROM periods
                WHERE user_id = ${req.userId}`;

    // Skip mostRecentPeriod if the user has no entries
    if (!periods.length) {
      return res.status(200).json({
        message: "No entries found.",
        periods,
      });
    }

    // Get the latest period start date to calculate next start date and fertility window
    const mostRecentPeriod = periods.reduce((mostRecent, current) => {
      if (current.start_date > mostRecent.start_date) {
        return current;
      }
      return mostRecent;
    }, periods[0]);

    const calculations = periodCalculations(mostRecentPeriod.start_date);

    return res.status(200).json({
      message: "Successfully retrieved entries!",
      periods,
      calculations,
    });
  } catch (error) {
    console.error("Error loading entries: ", error);
    return res.status(500).json({
      error:
        "Something went wrong when trying to get your entries. Please try again.",
    });
  }
}

export async function updatePeriod(req, res) {
  if (!req.params?.id) {
    return res.status(500).json({
      error: "Please provide which entry you would like to update.",
    });
  }
  try {
    const period = await sql`
      UPDATE periods
      SET start_date = COALESCE(${req.body.start_date}, start_date),
          end_date = COALESCE(${req.body.end_date}, end_date)
      WHERE id = ${req.params.id} AND user_id = ${req.userId}
      RETURNING
        start_date::text AS start_date,
        end_date::text AS end_date,
        user_id,
        id
    `;

    return res.status(200).json({
      message: "Successfully updated entry!",
      period,
    });
  } catch (error) {
    console.error("Error update entry: ", error);
    return res.status(500).json({
      error: "Unable to update entry, please try again.",
    });
  }
}
