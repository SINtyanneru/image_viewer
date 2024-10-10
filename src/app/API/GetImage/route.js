import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";

import { GET_CACHE } from "../../../MODULE/ImageCache";

export async function GET(req, res) {
	const PARAM = new URLSearchParams(new URL(req.url).search);

	if (PARAM.get("PATH") != null && PARAM.get("I") != null) {
		const DATA = await GET_CACHE(PARAM.get("PATH"), PARAM.get("I"), false);
		const MIME = await fileTypeFromBuffer(DATA);

		return new Response(DATA, {
			status: 200,
			headers: {
				"Content-Type": MIME.mime
			}
		});
	} else {
		return NextResponse.json({"STATUS": false, "ERR": "URI_PARAM_GA_TALINAI"}, {status: 400});
	}
}