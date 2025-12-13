import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

const router = Router();

router.post("/register", async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ message: "name, email and password are required" });
    }

    try {
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

    if (existingUser.rows.length > 0) {
        return response.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
        [name, email, passwordHash]
    );

    response.status(201).json({ message: "User registered successfully" });
} catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
}

    response.status(200).json({ message: "User register success" });
});

export default router;