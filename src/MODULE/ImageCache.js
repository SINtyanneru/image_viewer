import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

import CONFIG from "../../Config.json";
import { Read } from "./ReadZIP";

const TMP_DIR = "/tmp";

function PATH_SANITIZE(PATH) {
	let FILENAME = PATH;
	FILENAME = FILENAME.replaceAll("../", "");
	FILENAME = FILENAME.replaceAll("/", "_");

	return FILENAME;
}

export async function EXISTS_CACHE(PATH) {
	const KHASH_PATH = `${TMP_DIR}/${PATH_SANITIZE(PATH)}/`;

	if (fs.existsSync(KHASH_PATH)) {
		return true;
	} else {
		return false;
	}
}

export async function GET_CACHE(PATH, I, TH) {
	const KHASH_PATH = `${TMP_DIR}/${PATH_SANITIZE(PATH)}`;
	let RESULT_DATA = null;

	if (!await EXISTS_CACHE(PATH)) {
		fs.mkdirSync(KHASH_PATH);

		const RESULT = await Read(`${CONFIG.DATA_DIR}/${PATH}` , true);

		//ファイルを全部書き出す
		for (let I = 0; I < RESULT.length; I++) {
			const IMAGE = RESULT[I];
			//元データ
			const DATA = Buffer.from(IMAGE["DATA"], "base64");
			//サムネ
			const RESIZEERU = await sharp(Buffer.from(IMAGE["DATA"], "base64")).resize(null, 200).toBuffer();

			//書き出す
			fs.writeFileSync(`${KHASH_PATH}/${I}`, DATA);
			fs.writeFileSync(`${KHASH_PATH}/${I}_TH`, RESIZEERU);
		}
	}

	//サムネか否か
	if (TH) {
		const DATA = fs.readFileSync(`${KHASH_PATH}/${I}_TH`);
		RESULT_DATA = Buffer.from(DATA, "base64");
	} else {
		const DATA = fs.readFileSync(`${KHASH_PATH}/${I}`);
		RESULT_DATA = Buffer.from(DATA, "base64");
	}

	return RESULT_DATA;
}