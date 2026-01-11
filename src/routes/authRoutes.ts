import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authenticateToken';
import { deleteMeController, patchMeController } from '../controllers/authController';

const router = Router();

router.post("/register", async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({
            message: "name, email and password are required",
        });
    }

    try {
        const existingUser = await pool.query(
            "SELECT 1 FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return response.status(400).json({
                message: "User already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email`,
            [name, email, passwordHash]
        );

        const user = result.rows[0];

        return response.status(201).json(user);
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
        });
    }
});


router.post("/login", async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: "email and password are required" });
    }

    try {
        const result = await pool.query(
            "SELECT id, password_hash FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return response.status(200).json({ message: "Login successful", token});
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }
});

router.patch("/me", authenticateToken, patchMeController);
router.delete("/me", authenticateToken, deleteMeController);

export default router;