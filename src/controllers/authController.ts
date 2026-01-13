import { Request, Response } from "express";
import { pool } from "../config/db";

//controller til að geta breytt upplýsingum um notanda
export const patchMeController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;

    const allowedFields = ["name", "phone", "email"];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (request.body[field] !== undefined) {
        updates[field] = request.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return response
        .status(400)
        .json({ message: "No valid fields to update" });
    }

    //ef email er breytt - athuga unique
    if (updates.email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [updates.email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return response.status(400).json({
          message: "Email already in use",
        });
      }
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const result = await pool.query(
      `
      UPDATE users
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING id, name, phone, email, created_at
      `,
      [...values, userId]
    );

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


//controller til að eyða eigin notandareikningi
export const deleteMeController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const confirm = request.body?.confirm === true;

    //ath hvort notandi eigi paddock eða stallion
    const paddocks = await pool.query(
      "SELECT 1 FROM paddocks WHERE owner_id = $1 LIMIT 1",
      [userId]
    );

    const stallions = await pool.query(
      "SELECT 1 FROM stallions WHERE owner_id = $1 LIMIT 1",
      [userId]
    );

    if ((paddocks.rows.length > 0 || stallions.rows.length > 0) && !confirm) {
      return response.status(400).json({
        message:
          "Confirmation required to delete user with paddocks or stallions",
      });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    return response.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};



