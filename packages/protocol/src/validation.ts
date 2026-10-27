export function record(
	value: unknown,
	fields: readonly string[],
): Record<string, unknown> {
	if (
		value === null ||
		typeof value !== "object" ||
		Array.isArray(value) ||
		value instanceof Uint8Array
	) {
		throw new ProtocolError("Expected record");
	}
	const row = value as Record<string, unknown>;
	const keys = Object.keys(row);
	if (
		keys.length !== fields.length ||
		fields.some((field) => !keys.includes(field))
	) {
		throw new ProtocolError("Unexpected or missing fields");
	}
	return row;
}

export function text(value: unknown, max = 200): asserts value is string {
	if (
		typeof value !== "string" ||
		!value.length ||
		value.length > max ||
		Array.from(value).some(
			(character) =>
				character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
		)
	) {
		throw new ProtocolError("Invalid text");
	}
}

export function integer(value: unknown, min = 1): asserts value is number {
	if (!Number.isSafeInteger(value) || (value as number) < min)
		throw new ProtocolError("Invalid integer");
}

export function uniqueStrings(
	value: unknown,
	max = 100,
): asserts value is string[] {
	if (!Array.isArray(value) || value.length > max)
		throw new ProtocolError("Invalid list");
	for (const item of value) text(item);
	if (new Set(value).size !== value.length)
		throw new ProtocolError("Duplicate list entry");
}
export class ProtocolError extends Error {}

export function timestamp(value: unknown): asserts value is string {
	text(value);
	if (
		!Number.isFinite(Date.parse(value)) ||
		new Date(value).toISOString() !== value
	)
		throw new ProtocolError("Ungültiger Zeitpunkt.");
}

/** Instrument timestamps may have no timezone; validation must not invent one. */
export function measurementTime(value: unknown): asserts value is string {
	text(value);
	const match =
		/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2}))?$/.exec(
			value,
		);
	if (!match) throw new ProtocolError("Ungültiger Messzeitpunkt.");
	const [, year, month, day, hour, minute, second, offsetHour, offsetMinute] =
		match;
	const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
	if (
		!Number.isFinite(date.getTime()) ||
		date.toISOString().slice(0, 10) !== `${year}-${month}-${day}` ||
		Number(hour) > 23 ||
		Number(minute) > 59 ||
		Number(second) > 59 ||
		(offsetHour !== undefined &&
			(Number(offsetHour) > 23 || Number(offsetMinute) > 59))
	)
		throw new ProtocolError("Ungültiger Messzeitpunkt.");
}
