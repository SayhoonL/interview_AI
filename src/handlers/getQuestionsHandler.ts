import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
} from "aws-lambda";

import {
    getAllQuestionMappings
} from "../repositories/questionRepository";

export async function handler(
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    try {
        const questions = await getAllQuestionMappings();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                questions
            })
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