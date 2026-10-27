import { createPrivateKey, sign } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import {
	assertResetLive,
	resetMessage,
} from "../packages/protocol/src/reset.ts";

try {
	const { values } = parseArgs({
		options: {
			request: { type: "string" },
			out: { type: "string" },
			"root-private": { type: "string" },
		},
		strict: true,
		allowPositionals: false,
	});
	if (
		!values.request ||
		!values.out ||
		(!values["root-private"] && !process.env.INTEGRITY_ROOT_PRIVATE_JWK_BASE64)
	) {
		throw new Error(
			"Usage: node scripts/integrity_authorize_reset.mjs --request request.json --out authorization.json --root-private root-private.jwk.json",
		);
	}
	const request = JSON.parse(await readFile(values.request, "utf8"));
	assertResetLive(request);
	const jwk = JSON.parse(
		values["root-private"]
			? await readFile(values["root-private"], "utf8")
			: Buffer.from(
					process.env.INTEGRITY_ROOT_PRIVATE_JWK_BASE64,
					"base64",
				).toString("utf8"),
	);
	if (jwk.kty !== "OKP" || jwk.crv !== "Ed25519" || !jwk.d)
		throw new Error("Expected private Ed25519 JWK");
	const root = createPrivateKey({ key: jwk, format: "jwk" });
	const signature = sign(
		null,
		Buffer.from(resetMessage(request), "utf8"),
		root,
	).toString("base64url");
	await writeFile(
		values.out,
		`${JSON.stringify({ request, signature }, null, 2)}\n`,
		{ flag: "wx", mode: 0o600 },
	);
	console.log("Reset authorization written.");
} catch {
	// Parse errors can contain fragments of secret JWK input.
	console.error(
		"Reset authorization failed. Check arguments, request validity, key and output path (must not exist).",
	);
	process.exitCode = 1;
}
