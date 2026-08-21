import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import "./custom.css";
import Layout from "./DocsLayout.vue";

export default {
	extends: DefaultTheme,
	Layout,
} satisfies Theme;
