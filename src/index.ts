import { pool } from "./db/client";

async function main() {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("Database connected!");
        console.log("Database time:", result.rows[0]);

        await pool.end();
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error);
    }
}

main();