import { pool } from "./db/client";
import { processQuestion } from "./services/questionService";

async function main() {
    try {
        const result = await processQuestion(
            "What is the difference between a process and a thread?"
        );

        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();