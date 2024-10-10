import { NextResponse } from "next/server";

import { GET_CACHE } from "../../../MODULE/ImageCache";

export async function GET(req, res) {
	const PARAM = new URLSearchParams(new URL(req.url).search);

	if (PARAM.get("PATH") != null) {
		await GET_CACHE(PARAM.get("PATH"), 0, false);

		return new Response(JSON.stringify({"STATUS": true}), {
			status: 200,
			headers: {
				"Content-Type": "application/json"
			}
		});
	} else {
		return NextResponse.json({"STATUS": false, "ERR": "URI_PARAM_GA_TALINAI"}, {status: 400});
	}
}