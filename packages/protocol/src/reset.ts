import * as ed25519 from "@noble/ed25519";
import { DAG_CBOR, decodeCanonical, parseContentId } from "./content.ts";
import { validateFgw } from "./fgw.ts";
import { validateNuclideVector } from "./nuclideVector.ts";
import { integer, ProtocolError, record, text } from "./validation.ts";

export const RESET_PROTOCOL = "fmblog-reset-to-stub/v1";
export const RESET_SCOPE = "stub-keep-security-v1";
export type Stub = {
	protocol: "fmblog-stub/v1";
	schema: 1;
	entities: {
		kind: "nuclideVector" | "fgw";
		id: string;
		data: Record<string, unknown>;
	}[];
};

export function readStub(original: Uint8Array): Stub {
	const stub = record(decodeCanonical(original), [
		"protocol",
		"schema",
		"entities",
	]);
	if (
		stub.protocol !== "fmblog-stub/v1" ||
		stub.schema !== 1 ||
		!Array.isArray(stub.entities)
	)
		throw new ProtocolError("Invalid stub manifest");
	const seen = new Set<string>();
	for (const value of stub.entities) {
		const entity = record(value, ["kind", "id", "data"]);
		text(entity.id);
		if (!["nuclideVector", "fgw"].includes(String(entity.kind)))
			throw new ProtocolError("Stub may contain only master data");
		const key = JSON.stringify([entity.kind, entity.id]);
		if (
			seen.has(key) ||
			!entity.data ||
			typeof entity.data !== "object" ||
			Array.isArray(entity.data) ||
			entity.data instanceof Uint8Array
		)
			throw new ProtocolError("Invalid stub entity");
		seen.add(key);
		if (entity.kind === "nuclideVector") validateNuclideVector(entity.data);
		if (entity.kind === "fgw") {
			validateFgw(entity.data);
			if (entity.id !== entity.data.nuclideKey)
				throw new ProtocolError("Invalid FGW identity");
		}
	}
	return stub as Stub;
}
export type ResetRequest = {
	protocol: typeof RESET_PROTOCOL;
	databaseId: string;
	serviceId: string;
	publication: number;
	logTip: string | null;
	securityVersion: number;
	generation: number;
	nextGeneration: number;
	stubCid: string;
	schema: number;
	scope: typeof RESET_SCOPE;
	administratorId: string;
	nonce: string;
	reason: string;
	issuedAt: string;
	expiresAt: string;
};

export function validateResetRequest(
	value: unknown,
): asserts value is ResetRequest {
	const row = record(value, [
		"protocol",
		"databaseId",
		"serviceId",
		"publication",
		"logTip",
		"securityVersion",
		"generation",
		"nextGeneration",
		"stubCid",
		"schema",
		"scope",
		"administratorId",
		"nonce",
		"reason",
		"issuedAt",
		"expiresAt",
	]);
	if (
		row.protocol !== RESET_PROTOCOL ||
		row.scope !== RESET_SCOPE ||
		row.schema !== 1
	)
		throw new ProtocolError("Invalid reset protocol/scope/schema");
	for (const key of ["databaseId", "serviceId", "administratorId"])
		text(row[key]);
	text(row.reason, 2000);
	if (typeof row.nonce !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(row.nonce))
		throw new ProtocolError("Invalid reset nonce");
	for (const key of ["publication", "securityVersion"]) integer(row[key], 0);
	integer(row.generation);
	integer(row.nextGeneration);
	if (row.nextGeneration !== row.generation + 1)
		throw new ProtocolError("Invalid next generation");
	parseContentId(row.stubCid, DAG_CBOR);
	if (row.logTip !== null) parseContentId(row.logTip, DAG_CBOR);
	if ((row.publication === 0) !== (row.logTip === null))
		throw new ProtocolError("Invalid log checkpoint");
	for (const key of ["issuedAt", "expiresAt"]) {
		text(row[key]);
		const date = new Date(row[key] as string);
		if (!Number.isFinite(date.getTime()) || date.toISOString() !== row[key])
			throw new ProtocolError("Invalid reset timestamp");
	}
	const lifetime =
		Date.parse(row.expiresAt as string) - Date.parse(row.issuedAt as string);
	if (lifetime <= 0 || lifetime > 86400000)
		throw new ProtocolError("Reset validity exceeds 24 hours");
}

/** Field order is part of the signed wire protocol; do not sort or omit fields. */
export function resetMessage(request: ResetRequest): string {
	validateResetRequest(request);
	return JSON.stringify([
		request.protocol,
		request.databaseId,
		request.serviceId,
		request.publication,
		request.logTip,
		request.securityVersion,
		request.generation,
		request.nextGeneration,
		request.stubCid,
		request.schema,
		request.scope,
		request.administratorId,
		request.nonce,
		request.reason,
		request.issuedAt,
		request.expiresAt,
	]);
}

export function assertResetLive(request: ResetRequest, now = Date.now()): void {
	validateResetRequest(request);
	if (
		now < Date.parse(request.issuedAt) ||
		now >= Date.parse(request.expiresAt)
	)
		throw new ProtocolError("Reset authorization expired or not yet valid");
}

/** Receipts are checked at completion time; a completed reset does not expire. */
export async function verifyResetAuthorization(
	request: ResetRequest,
	signature: Uint8Array,
	publicKey: Uint8Array,
	completedAt: string,
): Promise<void> {
	const message = new TextEncoder().encode(resetMessage(request));
	const completed = new Date(completedAt);
	if (
		!Number.isFinite(completed.getTime()) ||
		completed.toISOString() !== completedAt
	)
		throw new ProtocolError("Invalid reset completion timestamp");
	assertResetLive(request, completed.getTime());
	if (
		!(await ed25519.verifyAsync(signature, message, publicKey, {
			zip215: false,
		}))
	)
		throw new ProtocolError("Invalid root signature");
}
