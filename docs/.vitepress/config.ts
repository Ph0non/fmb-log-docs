import { defineConfig } from "vitepress";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.VITEPRESS_BASE ?? (repoName ? `/${repoName}/` : "/");

export default defineConfig({
	base,
	lang: "de-DE",
	title: "FMB Log",
	description: "Benutzer- und Administratorhandbuch",
	lastUpdated: true,
	ignoreDeadLinks: true,

	markdown: {
		math: true,
		config(md) {
			const stripSideEffectTags = (html: string) =>
				html
					.replace(/<style\b[\s\S]*?<\/style>/gi, "")
					.replace(/<script\b[\s\S]*?<\/script>/gi, "");

			// `markdown-it-mathjax3`/`mathxyjax3` can emit `<style>` tags per equation.
			// Vue templates reject side-effect tags, so strip them from rendered math output.
			for (const ruleName of ["math_inline", "math_block"] as const) {
				const render = md.renderer.rules[ruleName];
				if (!render) continue;
				md.renderer.rules[ruleName] = (...args) => {
					const html = render(...args);
					return typeof html === "string" ? stripSideEffectTags(html) : html;
				};
			}
		},
	},

	themeConfig: {
		nav: [
			{ text: "User Guide", link: "/user-guide/" },
			{ text: "Admin Guide", link: "/admin-guide/" },
			{ text: "Referenz", link: "/reference/" },
			{ text: "Architektur", link: "/architecture/" },
		],
		sidebar: {
			"/user-guide/": [
				{
					text: "User Guide",
					items: [
						{ text: "Überblick", link: "/user-guide/" },
						{ text: "Schnellstart", link: "/user-guide/quickstart" },
						{ text: "Suche & Deep-Links", link: "/user-guide/search" },
						{ text: "Datenqualität", link: "/user-guide/data-quality" },
						{ text: "Gebinde & Messungen", link: "/user-guide/containers" },
						{ text: "Import (RPT / GS)", link: "/user-guide/import" },
						{
							text: "Nuklidvektoren (NV)",
							link: "/user-guide/nuclide-vectors",
						},
						{ text: "FMK", link: "/user-guide/fmk" },
						{ text: "Tagesabrechnung", link: "/user-guide/reports" },
						{ text: "Einstellungen", link: "/user-guide/settings" },
						{ text: "Konto & Passwort", link: "/user-guide/account" },
						{ text: "Glossar", link: "/user-guide/glossary" },
					],
				},
			],
			"/admin-guide/": [
				{
					text: "Admin Guide",
					items: [
						{ text: "Überblick", link: "/admin-guide/" },
						{ text: "Ersteinrichtung", link: "/admin-guide/setup" },
						{ text: "Sicherheitsarchitektur", link: "/admin-guide/security" },
						{ text: "Benutzer", link: "/admin-guide/users" },
						{
							text: "Gruppen & Rechte",
							link: "/admin-guide/groups-permissions",
						},
						{ text: "Freigabewerte (FGW)", link: "/admin-guide/fgw" },
						{ text: "Betrieb & Datenbank", link: "/admin-guide/database" },
						{ text: "Technische Doku", link: "/admin-guide/technical" },
						{ text: "Troubleshooting", link: "/admin-guide/troubleshooting" },
					],
				},
			],
			"/reference/": [
				{
					text: "Referenz",
					items: [
						{ text: "Überblick", link: "/reference/" },
						{
							text: "Rechte (Permission Keys)",
							link: "/reference/permissions",
						},
						{ text: "Datenmodell", link: "/reference/data-model" },
						{ text: "Rechner & Formeln", link: "/reference/formulas" },
					],
				},
			],
			"/architecture/": [
				{
					text: "Architektur",
					items: [
						{ text: "Überblick", link: "/architecture/" },
						{
							text: "ADR‑001: CR‑SQLite",
							link: "/architecture/adr-001-crsqlite",
						},
						{
							text: "ADR‑002: Integrität & Signaturen",
							link: "/architecture/adr-002-integrity-signing",
						},
						{
							text: "ADR‑003: Protokoll‑Packfiles",
							link: "/architecture/adr-003-protocol-packs",
						},
					],
				},
			],
		},
		search: {
			provider: "local",
		},
		footer: {
			message: "FMB Log – Dokumentation",
			copyright: "©EWN GmbH 2025, Martin Klemann",
		},
	},
});
