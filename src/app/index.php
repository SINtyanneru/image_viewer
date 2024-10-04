<!DOCTYPE html>
<HTML>
	<HEAD>
		<TITLE>画像ビュワー</TITLE>
	</HEAD>
	<BODY>
		<H1>画像ビュワー</H1>
		<HR>
		<DIV ID="BOOK_LIST"></DIV>
	</BODY>
</HTML>
<SCRIPT>
	let EL = {
		BOOK_LIST: document.getElementById("BOOK_LIST")
	}

	window.addEventListener("load", async (E) => {
		await LOAD_BOOK_LIST();
	});

	async function LOAD_BOOK_LIST() {
		let AJAX = await fetch("/API/BookList");
		const RESULT = await AJAX.json();

		if (RESULT.STATUS) {
			for (let I = 0; I < RESULT.LIST.length; I++) {
				const ITEM = RESULT.LIST[I];
				if (ITEM.TYPE === "DIR") {
					let BOOK_ITEM = "";

					ITEM.BOOK.forEach(BOOK => {
						BOOK_ITEM += `
							<DIV>
								<A HREF="/view/${ITEM.NAME}/${BOOK.NAME}">${BOOK.NAME}</A>
							</DIV>
						`;
					});

					EL.BOOK_LIST.innerHTML += `
						<DETAILS>
							<SUMMARY>${ITEM.NAME}</SUMMARY>
							${BOOK_ITEM}
						</DETAILS>
					`;
				}
			}
		} else {
			EL.BOOK_LIST.innerHTML = "エラー";
		}
	}
</SCRIPT>