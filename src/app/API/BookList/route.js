import { NextResponse } from "next/server";
import CONFIG from "../../../../Config.json";
const fs = require("fs").promises;

export async function GET(req, res) {
	try {
		let BOOK_LIST = await LOAD_BOOKLIST(CONFIG.DATA_DIR);

		return NextResponse.json({"STATUS": true, "LIST": BOOK_LIST}, {status: 200});
	} catch(EX) {
		return NextResponse.json({"STATUS": false, "ERR": "SYSTEM_ERR", "EX": EX}, {status: 500});
	}
}

async function LOAD_BOOKLIST(DIR) {
	let BOOK_LIST = [];
	const FILE_LIST = await fs.readdir(DIR);
	for (let I = 0; I < FILE_LIST.length; I++) {
		const FILENAME = FILE_LIST[I];
		const PATH = DIR + "/" + FILENAME;

		const STAT = await fs.stat(PATH);
		if (STAT.isFile()) {
			//ファイルならzipか(zipじゃないものは弾く)
			if (FILENAME.endsWith(".zip")) {
				BOOK_LIST.push(
					{
						"NAME": FILENAME,
						"TYPE": "BOOK"
					}
				);
			}
		} else {
			//ディレクトリ
			BOOK_LIST.push(
				{
					"NAME": FILENAME,
					"TYPE": "DIR",
					//再帰的読み込み
					"BOOK": await LOAD_BOOKLIST(PATH)
				}
			);
		}
	}

	return BOOK_LIST;
}