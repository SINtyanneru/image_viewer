import { PHP_EXEC } from "../../../MODULE/PHP.js";

export async function GET(req, res) {
	try {
		return await PHP_EXEC(process.cwd() + "/src/app/view/[...slug]/index.html");
	} catch(EX) {
		return new Response("Eratta\n\n" + EX, {
			status: 500,
			headers: {
				"Content-Type": "text/text; charset=UTF-8"
			}
		});
	}
}
