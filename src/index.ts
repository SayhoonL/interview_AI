import { verifyDuplicate } from "./services/duplicateVerificationService";

async function main() {
  console.log(
    await verifyDuplicate(
    "Tell me about yourself",
    "Introduce yourself"
    )
  );
}

main();