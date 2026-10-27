export const DEVICE_CODES = ["is", "como", "lb124", "mc2"] as const;

export type DeviceCode = (typeof DEVICE_CODES)[number];

export const NUCLIDES = [
	"Mn54",
	"Co57",
	"Co60",
	"Zn65",
	"Nb94",
	"Ru106",
	"Ag108m",
	"Ag110m",
	"Sb125",
	"Cs134",
	"Cs137",
	"Ba133",
	"Ce144",
	"Eu152",
	"Eu154",
	"Eu155",
	"H3",
	"C14",
	"Cl36",
	"Fe55",
	"Ni59",
	"Ni63",
	"Sr90",
	"U233",
	"U234",
	"U235",
	"U238",
	"Pu239Pu240",
	"Pu238",
	"Pu241",
	"Am241",
	"Cm242",
	"Cm244",
] as const;

export type NuclideKey = (typeof NUCLIDES)[number];

export const RELEASE_PATHS = [
	"1a",
	"1a*",
	"2a",
	"3a",
	"1b/3c",
	"2b/4c",
	"3b/5c",
	"4b/6c",
	"6b/2c",
	"OF",
	"4a",
	"5b",
] as const;

export type ReleasePath = (typeof RELEASE_PATHS)[number];

export type FgwUnit = "Bq/g" | "Bq/cm²";

export function fgwUnitForPath(path: ReleasePath): FgwUnit {
	// FGW is in Bq/g, except: OF, 3a, 4a, 5b in Bq/cm².
	if (path === "OF" || path === "3a" || path === "4a" || path === "5b")
		return "Bq/cm²";
	return "Bq/g";
}
