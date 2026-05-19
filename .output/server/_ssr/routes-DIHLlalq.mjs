import { d as require_jsx_runtime, u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DIHLlalq.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			height: "100vh",
			background: "#0a0a1a",
			color: "#e0e0e0",
			fontFamily: "monospace"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				style: {
					fontSize: "2rem",
					marginBottom: "1rem"
				},
				children: "Web City"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					marginBottom: "2rem",
					color: "#888"
				},
				children: "作品が存在する都市"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/works",
				style: {
					padding: "0.75rem 2rem",
					border: "1px solid #444",
					color: "#e0e0e0",
					textDecoration: "none",
					transition: "border-color 0.2s"
				},
				children: "Enter City →"
			})
		]
	});
}
//#endregion
export { HomePage as component };
