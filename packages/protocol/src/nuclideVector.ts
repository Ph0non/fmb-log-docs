import {
	DEVICE_CODES,
	type DeviceCode,
	NUCLIDES,
	type NuclideKey,
	RELEASE_PATHS,
	type ReleasePath,
} from "./catalog.ts";
import {
	integer,
	ProtocolError,
	record,
	text,
	timestamp,
	uniqueStrings,
} from "./validation.ts";

export type NuclideVectorData = {
	year: number;
	name: string;
	description: string | null;
	createdAt: string;
	allowedPaths: ReleasePath[];
	nuclides: { nuclideKey: NuclideKey; percent: number }[];
	devicePaths: Record<DeviceCode, ReleasePath[]>;
};

function paths(value: unknown): asserts value is ReleasePath[] {
	uniqueStrings(value, RELEASE_PATHS.length);
	if (value.some((path) => !RELEASE_PATHS.includes(path as ReleasePath)))
		throw new ProtocolError("Unbekannter Freigabepfad.");
}

/** Validate the complete signed aggregate without normalizing or dropping data. */
export function validateNuclideVector(
	value: unknown,
): asserts value is NuclideVectorData {
	const row = record(value, [
		"year",
		"name",
		"description",
		"createdAt",
		"allowedPaths",
		"nuclides",
		"devicePaths",
	]);
	integer(row.year, 2000);
	if (row.year > 2100)
		throw new ProtocolError("Bitte ein gültiges Jahr (2000–2100) angeben.");
	text(row.name);
	if (row.name !== row.name.trim())
		throw new ProtocolError("Ungültiger Nuklidvektorname.");
	if (
		row.description !== null &&
		(typeof row.description !== "string" ||
			row.description.length > 10000 ||
			row.description.includes("\u0000"))
	)
		throw new ProtocolError("Ungültige Beschreibung.");
	timestamp(row.createdAt);
	paths(row.allowedPaths);
	const devices = record(row.devicePaths, DEVICE_CODES);
	for (const device of DEVICE_CODES) paths(devices[device]);
	if (!Array.isArray(row.nuclides) || row.nuclides.length > NUCLIDES.length)
		throw new ProtocolError("Ungültige Nuklidanteile.");
	const seen = new Set<string>();
	let sum = 0;
	for (const value of row.nuclides) {
		const nuclide = record(value, ["nuclideKey", "percent"]);
		text(nuclide.nuclideKey);
		if (
			!NUCLIDES.includes(nuclide.nuclideKey as NuclideKey) ||
			seen.has(nuclide.nuclideKey)
		)
			throw new ProtocolError("Unbekanntes oder doppeltes Nuklid.");
		seen.add(nuclide.nuclideKey);
		if (
			typeof nuclide.percent !== "number" ||
			!Number.isFinite(nuclide.percent) ||
			nuclide.percent <= 0 ||
			nuclide.percent > 100
		)
			throw new ProtocolError(
				"Nuklidanteile müssen größer als 0 und höchstens 100 sein.",
			);
		sum += nuclide.percent;
	}
	// The editor first creates an empty draft; it must not authorize any paths yet.
	if (!row.nuclides.length) {
		if (
			row.allowedPaths.length ||
			DEVICE_CODES.some((device) => (devices[device] as string[]).length)
		)
			throw new ProtocolError(
				"Ein leerer Nuklidvektor darf keine Freigabepfade enthalten.",
			);
	} else if (Math.abs(sum - 100) > 0.01 + 1e-12) {
		throw new ProtocolError("Summe der Anteile muss 100% ergeben.");
	}
}
