import { NextResponse } from "next/server";
import path from "path";

import CONFIG from "../../../../Config.json";
import { Read } from "../../../MODULE/ReadZIP";

export async function GET(req, res) {
	const PARAM = new URLSearchParams(new URL(req.url).search);

	if (PARAM.get("PATH") != null) {
		let FILENAME = PARAM.get("PATH");
		FILENAME = FILENAME.replaceAll("../", "");

		const RESULT = await Read(`${CONFIG.DATA_DIR}/${FILENAME}` ,false);

		return NextResponse.json(
			{
				"STATUS": true,
				"TITLE": path.basename(FILENAME).split(".")[0],
				"LIST": RESULT
			}
		, {status: 200});
	} else {
		return NextResponse.json({"STATUS": false, "ERR": "URI_PARAM_GA_TALINAI"}, {status: 400});
	}
}