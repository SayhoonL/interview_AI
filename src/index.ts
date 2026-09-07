import { pool } from "./db/client";
import { processQuestion } from "./services/questionService";

async function main() {
    try {
        const result = await processQuestion("How would you design Twitter?")

        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();