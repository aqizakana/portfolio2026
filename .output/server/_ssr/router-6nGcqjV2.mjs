import { a as createRouter, c as createFileRoute, d as require_jsx_runtime, l as createRootRoute, n as Scripts, o as Outlet, r as HeadContent, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-6nGcqjV2.js
var import_jsx_runtime = require_jsx_runtime();
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Web City" }
		],
		links: [{
			rel: "stylesheet",
			href: "/style.css"
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ja",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-DIHLlalq.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./photo-Do2_rwMD.mjs");
gsapWithCSS.registerPlugin(ScrollTrigger);
var Route = createFileRoute("/photo/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
({
	white: "#FFFFFB",
	black: "#3A3226",
	gray: "#ddd",
	lightGray: "#e0e0e0",
	darkGray: "#888"
}).lightGray;
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	PhotoIndexRoute: Route.update({
		id: "/photo/",
		path: "/photo/",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
