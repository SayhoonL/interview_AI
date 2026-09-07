import { handler } from "./handlers/getQuestionsHandler";
import { pool } from "./db/client";

async function main() {
    try {
        const response = await handler({} as any);

        console.log("Status:", response.statusCode);

        if (
            typeof response === "object" &&
            response !== null &&
            "body" in response &&
            response.body
        ) {
            console.log(
                JSON.parse(response.body as string)
            );
        }
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

main();