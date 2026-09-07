import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
} from "aws-lambda";

import { processQuestion } from "../services/questionService";

export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Request body is required"
                })
            };
        }

        const body = JSON.parse(event.body);

        if (!body.question || typeof body.question !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "question is required"
                })
            };
        }

        const result = await processQuestion(body.question);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error"
            })
        };
    }
}