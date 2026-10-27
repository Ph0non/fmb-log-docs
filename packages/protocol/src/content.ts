import * as cbor from "@ipld/dag-cbor";
import { blake3 } from "@noble/hashes/blake3.js";
import { base32 } from "multiformats/bases/base32";
import { CID } from "multiformats/cid";
import { create } from "multiformats/hashes/digest";
import { ProtocolError } from "./validation.ts";

export const RAW = 0x55;
export const DAG_CBOR = 0x71;
export const MAX_BYTES = 16 * 1024 * 1024;

export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
	return a.length === b.length && a.every((value, i) => value === b[i]);
}

export function contentId(bytes: Uint8Array, codec = DAG_CBOR): string {
	if (codec !== RAW && codec !== DAG_CBOR)
		throw new ProtocolError("Unsupported codec");
	return CID.createV1(
		codec,
		create(0x1e, blake3(bytes, { dkLen: 32 })),
	).toString(base32);
}

export function parseContentId(value: unknown, codec?: number): CID {
	if (typeof value !== "string" || !/^b[a-z2-7]{58}$/.test(value))
		throw new ProtocolError("Invalid CID");
	let cid: CID;
	try {
		cid = CID.parse(value, base32);
	} catch {
		throw new ProtocolError("Invalid CID");
	}
	if (
		cid.version !== 1 ||
		![RAW, DAG_CBOR].includes(cid.code) ||
		cid.multihash.code !== 0x1e ||
		cid.multihash.size !== 32 ||
		(codec !== undefined && cid.code !== codec) ||
		cid.toString(base32) !== value
	) {
		throw new ProtocolError("Unsupported CID");
	}
	return cid;
}

export function encodeCanonical(value: unknown): Uint8Array {
	const bytes = cbor.encode(value);
	if (bytes.byteLength > MAX_BYTES) throw new ProtocolError("Object too large");
	return bytes;
}

export function decodeCanonical(bytes: Uint8Array): unknown {
	if (!bytes.length || bytes.length > MAX_BYTES)
		throw new ProtocolError("Invalid object size");
	try {
		const value = cbor.decode(bytes);
		if (!equalBytes(bytes, encodeCanonical(value)))
			throw new ProtocolError("Noncanonical DAG-CBOR");
		return value;
	} catch {
		throw new ProtocolError("Invalid or noncanonical DAG-CBOR");
	}
}

export function assertContent(
	bytes: Uint8Array,
	cid: string,
	codec?: number,
): void {
	const parsed = parseContentId(cid, codec);
	if (contentId(bytes, parsed.code) !== cid)
		throw new ProtocolError("CID does not match bytes");
	if (parsed.code === DAG_CBOR) decodeCanonical(bytes);
}
