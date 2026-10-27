import {
	type FgwUnit,
	fgwUnitForPath,
	NUCLIDES,
	type NuclideKey,
	RELEASE_PATHS,
	type ReleasePath,
} from "./catalog.ts";
import { ProtocolError, record, timestamp } from "./validation.ts";

export type FgwData = {
	nuclideKey: NuclideKey;
	updatedAt: string;
	values: { path: ReleasePath; value: number; unit: FgwUnit }[];
};

export type FgwEntry = {
	nuclideKey: string;
	path: ReleasePath;
	value: number;
	unit: FgwUnit;
};

export function groupFgwEntries(
	entries: readonly FgwEntry[],
	updatedAt: string,
): FgwData[] {
	if (!entries.length)
		throw new ProtocolError("Keine Freigabewerte vorhanden.");
	const rows = new Map<string, FgwData>();
	for (const entry of entries) {
		record(entry, ["nuclideKey", "path", "value", "unit"]);
		let row = rows.get(entry.nuclideKey);
		if (!row) {
			row = {
				nuclideKey: entry.nuclideKey as NuclideKey,
				updatedAt,
				values: [],
			};
			rows.set(entry.nuclideKey, row);
		}
		row.values.push({ path: entry.path, value: entry.value, unit: entry.unit });
	}
	for (const row of rows.values()) validateFgw(row);
	return [...rows.values()];
}

/** A version contains all available release values for exactly one nuclide. */
export function validateFgw(value: unknown): asserts value is FgwData {
	const row = record(value, ["nuclideKey", "updatedAt", "values"]);
	if (!NUCLIDES.includes(row.nuclideKey as NuclideKey))
		throw new ProtocolError("Unbekanntes Nuklid.");
	timestamp(row.updatedAt);
	if (
		!Array.isArray(row.values) ||
		!row.values.length ||
		row.values.length > RELEASE_PATHS.length
	)
		throw new ProtocolError("Mindestens ein Freigabewert ist erforderlich.");
	const paths = new Set<string>();
	for (const value of row.values) {
		const entry = record(value, ["path", "value", "unit"]);
		if (
			!RELEASE_PATHS.includes(entry.path as ReleasePath) ||
			paths.has(entry.path as string)
		)
			throw new ProtocolError("Ungültiger oder doppelter Freigabepfad.");
		paths.add(entry.path as string);
		if (entry.unit !== fgwUnitForPath(entry.path as ReleasePath))
			throw new ProtocolError("Einheit passt nicht zum Freigabepfad.");
		if (
			typeof entry.value !== "number" ||
			!Number.isFinite(entry.value) ||
			entry.value <= 0
		)
			throw new ProtocolError("Freigabewert muss endlich und größer 0 sein.");
	}
}
