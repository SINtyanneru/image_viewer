import path from "path";
import yauzl from "yauzl";

export async function Read (PATH, RequestDATA) {
	return new Promise((resolve, reject) => {
		let IMAGE_LIST = [];

		yauzl.open(PATH, { lazyEntries: true }, (EX, ZIPFILE) => {
			if (EX) {
				reject(EX);
			}

			//0番目のファイルを読む
			ZIPFILE.readEntry();

			//ファイルを読み込む
			ZIPFILE.on("entry", (ENTRY) => {
				//拡張子が画像か
				if (ENTRY.fileName.endsWith(".png") || ENTRY.fileName.endsWith(".jpg") || ENTRY.fileName.endsWith(".jpeg")) {
					//ディレクトリならその中を読む
					if (ENTRY.fileName.endsWith("/")) {
						ZIPFILE.readEntry();
					} else {
						if (RequestDATA) {
							//ファイルの中身を読む
							ZIPFILE.openReadStream(ENTRY, (EX, RS) => {
								if (EX) {
									reject(EX);
								}

								let FILE_CONTENT = [];
								RS.on("data", (CHUNK) => {
									FILE_CONTENT.push(CHUNK);
								});

								RS.on("end", () => {
									IMAGE_LIST.push({
										"NAME": path.basename(ENTRY.fileName),
										"MIME": CHECK_MIME(ENTRY.fileName),
										"DATA": Buffer.concat(FILE_CONTENT).toString("base64")
									});
								});
							});
						} else {
							IMAGE_LIST.push({
								"NAME": path.basename(ENTRY.fileName),
								"MIME": CHECK_MIME(ENTRY.fileName),
								"DATA": null
							});
						}
					}
				}

				//次を読む
				ZIPFILE.readEntry();
			});

			//終了
			ZIPFILE.on("end", () => {
				resolve(IMAGE_LIST);
			});
		});
	});
}

function CHECK_MIME(FILE_NAME) {
	const MIME = {
		".png":"image/png",
		".jpg":"image/jpeg",
		".jpeg":"image/jpeg"
	};

	if (MIME[path.extname(FILE_NAME)] != null) {
		return MIME[path.extname(FILE_NAME)];
	} else {
		return "plain/text"
	}
}