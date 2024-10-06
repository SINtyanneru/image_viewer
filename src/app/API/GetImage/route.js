import { NextResponse } from "next/server";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

import CONFIG from "../../../../Config.json";
import { Read } from "../../../MODULE/ReadZIP";

export async function GET(req, res) {
	const TMP_DIR = "/tmp";
	const PARAM = new URLSearchParams(new URL(req.url).search);

	if (PARAM.get("PATH") != null && PARAM.get("I") != null) {
		let FILENAME = PARAM.get("PATH");
		FILENAME = FILENAME.replaceAll("../", "");

		const KHASH_PATH = `${TMP_DIR}/${FILENAME.replaceAll("/", "_")}_${PARAM.get("I")}`;

		if (!fs.existsSync(KHASH_PATH)) {
			const RESULT = await Read(`${CONFIG.DATA_DIR}/${FILENAME}` , true);
			if (RESULT[PARAM.get("I")] != null) {
				const IMAGE = RESULT[PARAM.get("I")];
				const DATA = Buffer.from(IMAGE["DATA"], "base64");

				fs.writeFileSync(KHASH_PATH, DATA);
	
				return new Response(DATA, {
					status: 200,
					headers: {
						"Content-Type": IMAGE["MIME"]
					}
				});
			} else {
				return NextResponse.json({"STATUS": false}, {status: 404});
			}
		} else {
			const DATA = fs.readFileSync(KHASH_PATH);
			const MIME = await fileTypeFromBuffer(DATA);

			return new Response(DATA, {
				status: 200,
				headers: {
					"Content-Type": MIME.mime
				}
			});
		}
	} else {
		return NextResponse.json({"STATUS": false, "ERR": "URI_PARAM_GA_TALINAI"}, {status: 400});
	}
}