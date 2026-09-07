import { generateEmbedding } from "../services/embeddingService";
import { verifyDuplicate } from "../services/duplicateVerificationService";

type TestPair = {
  questionA: string;
  questionB: string;
  sameMeaning: boolean;
};

const testPairs: TestPair[] = [
  // SHOULD MATCH
  {
    questionA: "Tell me about yourself",
    questionB: "Introduce yourself",
    sameMeaning: true
  },
  {
    questionA: "Tell me about yourself",
    questionB: "Give me a quick introduction about yourself",
    sameMeaning: true
  },
  {
    questionA: "Design a URL shortener",
    questionB: "How would you build a URL shortening service?",
    sameMeaning: true
  },
  {
    questionA: "What is a race condition?",
    questionB: "Explain race conditions in concurrent programming",
    sameMeaning: true
  },
  {
    questionA: "What is the difference between a process and a thread?",
    questionB: "Explain how processes and threads are different",
    sameMeaning: true
  },
  {
    questionA: "What is deadlock?",
    questionB: "Explain deadlock in operating systems",
    sameMeaning: true
  },
  {
    questionA: "What are your greatest strengths?",
    questionB: "What would you say are your biggest strengths?",
    sameMeaning: true
  },
  {
    questionA: "Why do you want to work here?",
    questionB: "Why are you interested in working for this company?",
    sameMeaning: true
  },

  // SHOULD NOT MATCH
  {
    questionA: "Tell me about yourself",
    questionB: "What are your greatest strengths?",
    sameMeaning: false
  },
  {
    questionA: "Design a URL shortener",
    questionB: "Design a chat application",
    sameMeaning: false
  },
  {
    questionA: "What is a race condition?",
    questionB: "What is deadlock?",
    sameMeaning: false
  },
  {
    questionA: "What is SQL?",
    questionB: "What is Redis?",
    sameMeaning: false
  },
  {
    questionA: "What is the difference between a process and a thread?",
    questionB: "Explain virtual memory",
    sameMeaning: false
  },
  {
    questionA: "Why do you want to work here?",
    questionB: "Tell me about a difficult project",
    sameMeaning: false
  },
  {
    questionA: "What are your greatest strengths?",
    questionB: "What are your greatest weaknesses?",
    sameMeaning: false
  },
  {
    questionA: "Design Twitter",
    questionB: "Explain binary search",
    sameMeaning: false
  }
];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  return dot / (
    Math.sqrt(magnitudeA) *
    Math.sqrt(magnitudeB)
  );
}

async function main() {
  const threshold = 0.5;

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  for (const pair of testPairs) {
    const embeddingA = await generateEmbedding(pair.questionA);
    const embeddingB = await generateEmbedding(pair.questionB);

    const similarity = cosineSimilarity(
      embeddingA,
      embeddingB
    );

    let predictedDuplicate = false;
    let verifiedByClaude = false;

    if (similarity >= threshold) {
      predictedDuplicate = await verifyDuplicate(
        pair.questionA,
        pair.questionB
      );

      verifiedByClaude = true;
    }

    if (predictedDuplicate && pair.sameMeaning) {
      tp++;
    } else if (predictedDuplicate && !pair.sameMeaning) {
      fp++;
    } else if (!predictedDuplicate && !pair.sameMeaning) {
      tn++;
    } else {
      fn++;
    }

    console.log(
      `${pair.sameMeaning ? "EXPECTED MATCH" : "EXPECTED NO MATCH"} | ` +
      `similarity=${similarity.toFixed(3)} | ` +
      `claude=${verifiedByClaude ? predictedDuplicate : "SKIPPED"} | ` +
      `"${pair.questionA}" ↔ "${pair.questionB}"`
    );
  }

  const precision =
    tp + fp === 0 ? 0 : tp / (tp + fp);

  const recall =
    tp + fn === 0 ? 0 : tp / (tp + fn);

  const f1 =
    precision + recall === 0
      ? 0
      : 2 * (
        (precision * recall) /
        (precision + recall)
      );

  console.log("\nFINAL TWO-STAGE RESULTS\n");

  console.log({
    threshold,
    TP: tp,
    FP: fp,
    TN: tn,
    FN: fn,
    precision: precision.toFixed(3),
    recall: recall.toFixed(3),
    f1: f1.toFixed(3)
  });
}

main().catch(console.error);