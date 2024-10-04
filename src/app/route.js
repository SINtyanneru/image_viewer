import { stderr, stdout } from "process";

const fs = require("fs").promises;
const { exec } = require("child_process");

export async function GET(req, res) {
	try {
		return new Promise((resolve, reject) => {
			exec(`/usr/bin/php -f ${process.cwd()}/src/app/index.php`, (error, stdout, stderr) => {
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
	} catch(EX) {
		return new Response("Eratta<BR><PRE>" + EX + "</PRE>", {
			status: 500,
			headers: {
				"Content-Type": "text/html; charset=UTF-8"
			}
		});
	}
}
