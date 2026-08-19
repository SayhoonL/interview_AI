import { enhanceQuestion } from "./services/questionEnhancementService";

async function main() {
    try {
        const result = await enhanceQuestion(
            "design a url shortener"
        );

        console.log(result);

    } catch (error) {
        console.error(error);
    }
}

main();