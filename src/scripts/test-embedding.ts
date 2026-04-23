import { generateEmbedding, findSimilarContent } from "../lib/ai";

async function run() {
	console.log("Testing generateEmbedding...");
	try {
		const vector = await generateEmbedding("How to communicate better with my partner?");
		console.log(`Generated embedding of length: ${vector.length}`);
		
		console.log("Testing findSimilarContent...");
		const results = await findSimilarContent("How to communicate better with my partner?", 2);
		console.log("Found similar content:", results);
		
		process.exit(0);
	} catch (error) {
		console.error("Test failed:", error);
		process.exit(1);
	}
}

run();
