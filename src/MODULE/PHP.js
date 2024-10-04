const { exec } = require("child_process");

export async function PHP_EXEC(FILE) {
	return new Promise((resolve, reject) => {
		exec(`/usr/bin/php -f ${FILE}`, (error, stdout, stderr) => {
			if (stderr) {
				resolve(new Response("Eratta<BR><PRE></PRE>", {
					status: 500,
					headers: {
						"Content-Type": "text/html; charset=UTF-8"
					}
				}));
			}
			resolve(new Response(stdout, {
				headers: {
					"Content-Type": "text/html; charset=UTF-8"
				}
			}));
		});
	});
}