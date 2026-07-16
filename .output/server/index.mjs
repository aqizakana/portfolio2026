globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import "./_libs/hookable.mjs";
import { t as getContext } from "./_libs/unctx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import "node:async_hooks";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
getContext("nitro-app", {
	asyncContext: void 0,
	AsyncLocalStorage: void 0
});
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/SDIM4876_DxO-BQeW876E.jpg": {
		"type": "image/jpeg",
		"etag": "\"17058-irBpLgCpDb9+p5yERZE9+I8KO5U\"",
		"mtime": "2026-07-16T13:22:02.164Z",
		"size": 94296,
		"path": "../public/assets/SDIM4876_DxO-BQeW876E.jpg"
	},
	"/assets/SDIM4886_DxO-CMvDl2Zc.jpg": {
		"type": "image/jpeg",
		"etag": "\"8759-66a6oyJ6I8NPCwCSwCOxOEjAwII\"",
		"mtime": "2026-07-16T13:22:02.165Z",
		"size": 34649,
		"path": "../public/assets/SDIM4886_DxO-CMvDl2Zc.jpg"
	},
	"/assets/SDIM4898_DxO-BubChk7c.jpg": {
		"type": "image/jpeg",
		"etag": "\"17d7a-Ka7BxCGb1FiWmB9qyCZUCfFFIjg\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 97658,
		"path": "../public/assets/SDIM4898_DxO-BubChk7c.jpg"
	},
	"/assets/SDIM4883_DxO-DI7wPCxG.jpg": {
		"type": "image/jpeg",
		"etag": "\"1228b-LchkxNAyUftO55V5B45n1S3iTK4\"",
		"mtime": "2026-07-16T13:22:02.165Z",
		"size": 74379,
		"path": "../public/assets/SDIM4883_DxO-DI7wPCxG.jpg"
	},
	"/style.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"ca-xt5x53e+mkZaE7SXwOfGNS//TvA\"",
		"mtime": "2026-07-16T13:22:02.307Z",
		"size": 202,
		"path": "../public/style.css"
	},
	"/assets/SDIM4860_DxO-sbTubBWn.jpg": {
		"type": "image/jpeg",
		"etag": "\"16964-BXbcoGu2N9YWsk0amvJ/YEoOy7c\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 92516,
		"path": "../public/assets/SDIM4860_DxO-sbTubBWn.jpg"
	},
	"/assets/SDIM4897_DxO-Dg4Pql_1.jpg": {
		"type": "image/jpeg",
		"etag": "\"21c3c-wfRBVYCpuYlcbMMyNvSvOQz1XqA\"",
		"mtime": "2026-07-16T13:22:02.165Z",
		"size": 138300,
		"path": "../public/assets/SDIM4897_DxO-Dg4Pql_1.jpg"
	},
	"/assets/SDIM5324_DxO-BR2fT7xk.jpg": {
		"type": "image/jpeg",
		"etag": "\"22aca-NUad4KB8GQnZgK3J9OdhdE3hfH4\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 142026,
		"path": "../public/assets/SDIM5324_DxO-BR2fT7xk.jpg"
	},
	"/assets/SDIM4866_DxO-Cz3T4sV3.jpg": {
		"type": "image/jpeg",
		"etag": "\"24566-iSh9vyVbQek4Tn3eDmww9Ex2bJM\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 148838,
		"path": "../public/assets/SDIM4866_DxO-Cz3T4sV3.jpg"
	},
	"/assets/SDIM5335_DxO-DuBBQ-Q8.jpg": {
		"type": "image/jpeg",
		"etag": "\"20ab4-j7BmS/CaskP/P09OVPcnTjrqRig\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 133812,
		"path": "../public/assets/SDIM5335_DxO-DuBBQ-Q8.jpg"
	},
	"/assets/SDIM5341_DxO-B6z6w7rA.jpg": {
		"type": "image/jpeg",
		"etag": "\"1bd87-XlUVwNA+PddnRqk8ExwNfGeKNDM\"",
		"mtime": "2026-07-16T13:22:02.167Z",
		"size": 114055,
		"path": "../public/assets/SDIM5341_DxO-B6z6w7rA.jpg"
	},
	"/assets/SDIM5336_DxO-Bw5956pG.jpg": {
		"type": "image/jpeg",
		"etag": "\"20ada-xkbf0mzpfaHNvYfZHEcoco3WEiQ\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 133850,
		"path": "../public/assets/SDIM5336_DxO-Bw5956pG.jpg"
	},
	"/assets/SDIM5730_DxO-BpbXas_E.jpg": {
		"type": "image/jpeg",
		"etag": "\"9dd6-7NnkAV6Y2hYQKIwtV+2EziRjR/4\"",
		"mtime": "2026-07-16T13:22:02.168Z",
		"size": 40406,
		"path": "../public/assets/SDIM5730_DxO-BpbXas_E.jpg"
	},
	"/assets/SDIM5357_DxO-DsHNLnTv.jpg": {
		"type": "image/jpeg",
		"etag": "\"310b0-X9gwpgW4QOSDqK+HopeBwncgC0w\"",
		"mtime": "2026-07-16T13:22:02.168Z",
		"size": 200880,
		"path": "../public/assets/SDIM5357_DxO-DsHNLnTv.jpg"
	},
	"/assets/SDIM5349_DxO-CWlDhPF7.jpg": {
		"type": "image/jpeg",
		"etag": "\"28bdf-anjcFJ5Fpm7ursUFTi2JSTlT4ck\"",
		"mtime": "2026-07-16T13:22:02.167Z",
		"size": 166879,
		"path": "../public/assets/SDIM5349_DxO-CWlDhPF7.jpg"
	},
	"/assets/SDIM5327_DxO-DMT3AJDm.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ab0e-f6sDPryl8EFWX5YBQJ2tY2BMujY\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 109326,
		"path": "../public/assets/SDIM5327_DxO-DMT3AJDm.jpg"
	},
	"/assets/SDIM5758_DxO-ChoE-6-m.jpg": {
		"type": "image/jpeg",
		"etag": "\"220e8-vIGH/YSUbwT9HhfY7y11XG3pOi0\"",
		"mtime": "2026-07-16T13:22:02.168Z",
		"size": 139496,
		"path": "../public/assets/SDIM5758_DxO-ChoE-6-m.jpg"
	},
	"/assets/SDIM5775_DxO-DHcQq8ah.jpg": {
		"type": "image/jpeg",
		"etag": "\"2a636-HciIG8ll8sAcLCx0MvvDxEJuE7s\"",
		"mtime": "2026-07-16T13:22:02.169Z",
		"size": 173622,
		"path": "../public/assets/SDIM5775_DxO-DHcQq8ah.jpg"
	},
	"/assets/SDIM5869_DxO-CYGSdVVD.jpg": {
		"type": "image/jpeg",
		"etag": "\"8599-J9vZinVlIr+OqcKmJACG39L7Z2M\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 34201,
		"path": "../public/assets/SDIM5869_DxO-CYGSdVVD.jpg"
	},
	"/assets/SDIM5889_DxO-BAt37TtO.jpg": {
		"type": "image/jpeg",
		"etag": "\"c1d2-n1WLdCDOKnK3WwuaJ6pe0kZa2Ks\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 49618,
		"path": "../public/assets/SDIM5889_DxO-BAt37TtO.jpg"
	},
	"/assets/SDIM5911_DxO-BUJTFEr2.jpg": {
		"type": "image/jpeg",
		"etag": "\"2651c-6sTFkvr1loL0y0dKGIdC+bUWv5c\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 156956,
		"path": "../public/assets/SDIM5911_DxO-BUJTFEr2.jpg"
	},
	"/assets/SDIM5805_DxO-DDZzaAEY.jpg": {
		"type": "image/jpeg",
		"etag": "\"110ed-E7nhRtXHmPxGf9xnA4yYG/hLkow\"",
		"mtime": "2026-07-16T13:22:02.169Z",
		"size": 69869,
		"path": "../public/assets/SDIM5805_DxO-DDZzaAEY.jpg"
	},
	"/assets/SDIM5337_DxO-PcVqmLav.jpg": {
		"type": "image/jpeg",
		"etag": "\"182ec-Z4iebyVu1G53u9uzc1AZYcpSumc\"",
		"mtime": "2026-07-16T13:22:02.166Z",
		"size": 99052,
		"path": "../public/assets/SDIM5337_DxO-PcVqmLav.jpg"
	},
	"/assets/SDIM4885_DxO-9QaEa2e3.jpg": {
		"type": "image/jpeg",
		"etag": "\"dd75-GVg4g97dtVRv4asYv7XG5T4ZOaQ\"",
		"mtime": "2026-07-16T13:22:02.165Z",
		"size": 56693,
		"path": "../public/assets/SDIM4885_DxO-9QaEa2e3.jpg"
	},
	"/assets/SDIM5835_DxO-RYvANMZt.jpg": {
		"type": "image/jpeg",
		"etag": "\"37ba1-lb+qwKyqiy6kd5ZaRdz3r8yXSI8\"",
		"mtime": "2026-07-16T13:22:02.169Z",
		"size": 228257,
		"path": "../public/assets/SDIM5835_DxO-RYvANMZt.jpg"
	},
	"/assets/SDIM5937_DxO-C2F_Kxl2.jpg": {
		"type": "image/jpeg",
		"etag": "\"16b74-lKvRQriRuTI36EICGZOq+6qIshE\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 93044,
		"path": "../public/assets/SDIM5937_DxO-C2F_Kxl2.jpg"
	},
	"/assets/SDIM5975_DxO-D5cG1SYj.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ecc0-Vc1Iv9tjFKMeMW8lBwfI53wrqPQ\"",
		"mtime": "2026-07-16T13:22:02.171Z",
		"size": 126144,
		"path": "../public/assets/SDIM5975_DxO-D5cG1SYj.jpg"
	},
	"/assets/SDIM5972_DxO-Co2UvQyR.jpg": {
		"type": "image/jpeg",
		"etag": "\"221f1-xNN4pwmr7mK24yGVnuTuUf2pQPA\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 139761,
		"path": "../public/assets/SDIM5972_DxO-Co2UvQyR.jpg"
	},
	"/assets/SDIM5968_DxO-BSm1gvne.jpg": {
		"type": "image/jpeg",
		"etag": "\"27dec-PIMxhq2RWGzNNgJO3m7CIkZsyp0\"",
		"mtime": "2026-07-16T13:22:02.170Z",
		"size": 163308,
		"path": "../public/assets/SDIM5968_DxO-BSm1gvne.jpg"
	},
	"/assets/SDIM5990_DxO-DquLY1Q4.jpg": {
		"type": "image/jpeg",
		"etag": "\"20e69-npIirb/WNn/JzXwT49ys2i7PRt0\"",
		"mtime": "2026-07-16T13:22:02.171Z",
		"size": 134761,
		"path": "../public/assets/SDIM5990_DxO-DquLY1Q4.jpg"
	},
	"/assets/SDIM6086_DxO-Tb2kejH5.jpg": {
		"type": "image/jpeg",
		"etag": "\"11ba8-vCKSEIBNBJh3ow6HaMrtFXF8Brk\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 72616,
		"path": "../public/assets/SDIM6086_DxO-Tb2kejH5.jpg"
	},
	"/assets/SDIM5997_DxO-Dsm2Lf2w.jpg": {
		"type": "image/jpeg",
		"etag": "\"29ef5-3wpfOrtGoUis9WyKWhWs+88MEzg\"",
		"mtime": "2026-07-16T13:22:02.171Z",
		"size": 171765,
		"path": "../public/assets/SDIM5997_DxO-Dsm2Lf2w.jpg"
	},
	"/assets/SDIM6006_DxO-ChzcH3Iy.jpg": {
		"type": "image/jpeg",
		"etag": "\"19749-N3KSsbbokyb7ULIOZPmRHm8owwE\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 104265,
		"path": "../public/assets/SDIM6006_DxO-ChzcH3Iy.jpg"
	},
	"/assets/SDIM6111_DxO-CGPGqjYc.jpg": {
		"type": "image/jpeg",
		"etag": "\"9052-dSt4PHcKPwKB6g+y8K7a48Gnn+g\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 36946,
		"path": "../public/assets/SDIM6111_DxO-CGPGqjYc.jpg"
	},
	"/assets/SDIM6100_DxO-CB5vcMnx.jpg": {
		"type": "image/jpeg",
		"etag": "\"14ea5-fY3HgI5/4j3KChAQM6Inl6TbJgY\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 85669,
		"path": "../public/assets/SDIM6100_DxO-CB5vcMnx.jpg"
	},
	"/assets/SDIM6129_DxO-CAwz-BK2.jpg": {
		"type": "image/jpeg",
		"etag": "\"12a90-C78CJ+IkKgKv/tohAdHj5l6oMbc\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 76432,
		"path": "../public/assets/SDIM6129_DxO-CAwz-BK2.jpg"
	},
	"/assets/SDIM6121_DxO-Bqnq9nbY.jpg": {
		"type": "image/jpeg",
		"etag": "\"12dfa-x6q7Zql/se8zxadXDz5vuU6aIb0\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 77306,
		"path": "../public/assets/SDIM6121_DxO-Bqnq9nbY.jpg"
	},
	"/assets/SDIM6134_DxO-DmB1QyPG.jpg": {
		"type": "image/jpeg",
		"etag": "\"fe35-AxQXrKCoQOYi9xYI/iVaw+RTkOI\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 65077,
		"path": "../public/assets/SDIM6134_DxO-DmB1QyPG.jpg"
	},
	"/assets/SDIM6140_DxO-COxNJZ0P.jpg": {
		"type": "image/jpeg",
		"etag": "\"11edf-uYv3EiwqzQWvrQ4uQZbigXxCZ3A\"",
		"mtime": "2026-07-16T13:22:02.172Z",
		"size": 73439,
		"path": "../public/assets/SDIM6140_DxO-COxNJZ0P.jpg"
	},
	"/assets/SDIM6159_DxO-ByGQsk9w.jpg": {
		"type": "image/jpeg",
		"etag": "\"8378-6uUkOsM3jnbUnIQaswOlMMudYyE\"",
		"mtime": "2026-07-16T13:22:02.173Z",
		"size": 33656,
		"path": "../public/assets/SDIM6159_DxO-ByGQsk9w.jpg"
	},
	"/assets/SDIM6148_DxO-5pz7F_5k.jpg": {
		"type": "image/jpeg",
		"etag": "\"185b7-X5EqBhapVSduoDgRtaSem9JfMno\"",
		"mtime": "2026-07-16T13:22:02.173Z",
		"size": 99767,
		"path": "../public/assets/SDIM6148_DxO-5pz7F_5k.jpg"
	},
	"/assets/SDIM6220_DxO-BTvGaptI.jpg": {
		"type": "image/jpeg",
		"etag": "\"17866-M2aLPyc6q2dlpppjhEkCb3mfQTc\"",
		"mtime": "2026-07-16T13:22:02.174Z",
		"size": 96358,
		"path": "../public/assets/SDIM6220_DxO-BTvGaptI.jpg"
	},
	"/assets/SDIM6271_DxO-DIUAAJCk.jpg": {
		"type": "image/jpeg",
		"etag": "\"580a-yr46seN5DfEf+XoIWDuFuITAL5c\"",
		"mtime": "2026-07-16T13:22:02.174Z",
		"size": 22538,
		"path": "../public/assets/SDIM6271_DxO-DIUAAJCk.jpg"
	},
	"/assets/SDIM6197_DxO-CR2Ju_g1.jpg": {
		"type": "image/jpeg",
		"etag": "\"1e5bf-HD01Wo42HGvNbiz0FmS4nMG/5qs\"",
		"mtime": "2026-07-16T13:22:02.174Z",
		"size": 124351,
		"path": "../public/assets/SDIM6197_DxO-CR2Ju_g1.jpg"
	},
	"/assets/SDIM6251_DxO-klr6-NR3.jpg": {
		"type": "image/jpeg",
		"etag": "\"192f5-9dL0p4bdRHEVrDBOXszQTNlNTlI\"",
		"mtime": "2026-07-16T13:22:02.174Z",
		"size": 103157,
		"path": "../public/assets/SDIM6251_DxO-klr6-NR3.jpg"
	},
	"/assets/SDIM7099_DxO-CxPrWelY.jpg": {
		"type": "image/jpeg",
		"etag": "\"f2bd-hH75ZZ4PITBIBS4eF3dLufWKpWo\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 62141,
		"path": "../public/assets/SDIM7099_DxO-CxPrWelY.jpg"
	},
	"/assets/SDIM6273_DxO-B9DP_1uJ.jpg": {
		"type": "image/jpeg",
		"etag": "\"12020-Zp4CK/BC/KBLOfrDO8gDifix7oA\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 73760,
		"path": "../public/assets/SDIM6273_DxO-B9DP_1uJ.jpg"
	},
	"/assets/SDIM7101_DxO-IeQEvQ5Y.jpg": {
		"type": "image/jpeg",
		"etag": "\"f907-3O1K3uPrWKXshklU0tJgvAP2aII\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 63751,
		"path": "../public/assets/SDIM7101_DxO-IeQEvQ5Y.jpg"
	},
	"/assets/SDIM6254_DxO-Bk5tcLOc.jpg": {
		"type": "image/jpeg",
		"etag": "\"1c06b-+o+XIftzhaEdGRY7lL1RMrcKpZM\"",
		"mtime": "2026-07-16T13:22:02.174Z",
		"size": 114795,
		"path": "../public/assets/SDIM6254_DxO-Bk5tcLOc.jpg"
	},
	"/assets/SDIM7102_DxO-DHWgw9xT.jpg": {
		"type": "image/jpeg",
		"etag": "\"95aa-1dXSbV2VL7c9nDHc8/PS2of5gIo\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 38314,
		"path": "../public/assets/SDIM7102_DxO-DHWgw9xT.jpg"
	},
	"/assets/SDIM7109_DxO-BvVIbRsM.jpg": {
		"type": "image/jpeg",
		"etag": "\"b15e-1qCrjsKo38ZqrYyRANge5I+44Ac\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 45406,
		"path": "../public/assets/SDIM7109_DxO-BvVIbRsM.jpg"
	},
	"/assets/SDIM7106_DxO-ivyNtxnX.jpg": {
		"type": "image/jpeg",
		"etag": "\"d2b6-qd3JF8pAJ27YCsAjLIYuL34v8RU\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 53942,
		"path": "../public/assets/SDIM7106_DxO-ivyNtxnX.jpg"
	},
	"/assets/SDIM7112_DxO-CYJPJbHZ.jpg": {
		"type": "image/jpeg",
		"etag": "\"ec1f-5alDotOnKI6cHVJVNIV3fkHn1/0\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 60447,
		"path": "../public/assets/SDIM7112_DxO-CYJPJbHZ.jpg"
	},
	"/assets/SDIM7125_DxO-VUMzDjx7.jpg": {
		"type": "image/jpeg",
		"etag": "\"8bf1-GTzsi1k8yuJPbb0+sq039To8beY\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 35825,
		"path": "../public/assets/SDIM7125_DxO-VUMzDjx7.jpg"
	},
	"/assets/SDIM7115_DxO-BQh3UCgV.jpg": {
		"type": "image/jpeg",
		"etag": "\"cc0a-V90VYSyF4Zn4CVIyf0uPGICBSuY\"",
		"mtime": "2026-07-16T13:22:02.175Z",
		"size": 52234,
		"path": "../public/assets/SDIM7115_DxO-BQh3UCgV.jpg"
	},
	"/assets/SDIM7193_DxO-Ccb3Mq5x.jpg": {
		"type": "image/jpeg",
		"etag": "\"e830-dLzASuNfTecxURHy0UdjDmQNPuc\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 59440,
		"path": "../public/assets/SDIM7193_DxO-Ccb3Mq5x.jpg"
	},
	"/assets/SDIM7191_DxO-D2etCzPl.jpg": {
		"type": "image/jpeg",
		"etag": "\"182c6-glt2PKw2LSbNUrKPs+Ig9XDwoGY\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 99014,
		"path": "../public/assets/SDIM7191_DxO-D2etCzPl.jpg"
	},
	"/assets/SDIM7407_DxO-CS6jCcYS.jpg": {
		"type": "image/jpeg",
		"etag": "\"bebb-/FRoibFTopFWOG34BrPKPqe6na4\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 48827,
		"path": "../public/assets/SDIM7407_DxO-CS6jCcYS.jpg"
	},
	"/assets/SDIM7421_DxO-k82Oorna.jpg": {
		"type": "image/jpeg",
		"etag": "\"ec9c-RT6DJz/FM5qUQHVlkKiXJqIXrZw\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 60572,
		"path": "../public/assets/SDIM7421_DxO-k82Oorna.jpg"
	},
	"/assets/SDIM7408_DxO-BCDm_rr4.jpg": {
		"type": "image/jpeg",
		"etag": "\"1e974-Y1uAkr6bbTbp8kUSQLcJWO3yRqU\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 125300,
		"path": "../public/assets/SDIM7408_DxO-BCDm_rr4.jpg"
	},
	"/assets/SDIM7430_DxO-MiZXfJV5.jpg": {
		"type": "image/jpeg",
		"etag": "\"2c02c-W7rGrN6o/lfNRepiVmgpbdg35OY\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 180268,
		"path": "../public/assets/SDIM7430_DxO-MiZXfJV5.jpg"
	},
	"/assets/SDIM7417_DxO-BRUvEdh6.jpg": {
		"type": "image/jpeg",
		"etag": "\"11d2f-lBLaIHOymATaiCDymIm37XS27tw\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 73007,
		"path": "../public/assets/SDIM7417_DxO-BRUvEdh6.jpg"
	},
	"/assets/SDIM7650_DxO-C2k0MZDc.jpg": {
		"type": "image/jpeg",
		"etag": "\"a2fd-U5JOsP56dhHcV26edAoRuUJcClU\"",
		"mtime": "2026-07-16T13:22:02.177Z",
		"size": 41725,
		"path": "../public/assets/SDIM7650_DxO-C2k0MZDc.jpg"
	},
	"/assets/SDIM7653_DxO-CXTgBB23.jpg": {
		"type": "image/jpeg",
		"etag": "\"3ece-RsSsFv/zfrCyOE3sujUZV2cwQvs\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 16078,
		"path": "../public/assets/SDIM7653_DxO-CXTgBB23.jpg"
	},
	"/assets/SDIM7424_DxO-DyBfu2kH.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ee53-N12+Evgo/+HFdUDP6G5bljrrFBc\"",
		"mtime": "2026-07-16T13:22:02.176Z",
		"size": 126547,
		"path": "../public/assets/SDIM7424_DxO-DyBfu2kH.jpg"
	},
	"/assets/SDIM7655_DxO-Ck8lbT5v.jpg": {
		"type": "image/jpeg",
		"etag": "\"c162-pH2uY/Y1V8x+oYaVT3mjxtqj8Dw\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 49506,
		"path": "../public/assets/SDIM7655_DxO-Ck8lbT5v.jpg"
	},
	"/assets/SDIM7656_DxO-BMDxn-wb.jpg": {
		"type": "image/jpeg",
		"etag": "\"12260-P80r9h3im5s+Bq7PgnCeuhBTcdc\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 74336,
		"path": "../public/assets/SDIM7656_DxO-BMDxn-wb.jpg"
	},
	"/assets/SDIM7661_DxO-CeuG2REm.jpg": {
		"type": "image/jpeg",
		"etag": "\"11c07-6LeTFPBXmafmaaUtvQkO9BH3aBQ\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 72711,
		"path": "../public/assets/SDIM7661_DxO-CeuG2REm.jpg"
	},
	"/assets/SDIM7662_DxO-TEgGz0ou.jpg": {
		"type": "image/jpeg",
		"etag": "\"132a8-tZ+I1ozp6m4UHnayeZT5M++1V+U\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 78504,
		"path": "../public/assets/SDIM7662_DxO-TEgGz0ou.jpg"
	},
	"/assets/SDIM7666_DxO-Ddf-Epgg.jpg": {
		"type": "image/jpeg",
		"etag": "\"21b3e-tfwuNHCKdrFXy0TjLyPoyVWnzr8\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 138046,
		"path": "../public/assets/SDIM7666_DxO-Ddf-Epgg.jpg"
	},
	"/assets/SDIM7668_DxO-JapOcSDi.jpg": {
		"type": "image/jpeg",
		"etag": "\"16a2e-3f4askEpO/TxxI94Fm0GCuGGtBc\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 92718,
		"path": "../public/assets/SDIM7668_DxO-JapOcSDi.jpg"
	},
	"/assets/SDIM7669_DxO-Dnuthl8p.jpg": {
		"type": "image/jpeg",
		"etag": "\"10498-RyPBGjU20gV+bgMEnQng17sgC78\"",
		"mtime": "2026-07-16T13:22:02.180Z",
		"size": 66712,
		"path": "../public/assets/SDIM7669_DxO-Dnuthl8p.jpg"
	},
	"/assets/SDIM7687_DxO-Ow4v2eE8.jpg": {
		"type": "image/jpeg",
		"etag": "\"1110d-uM5qS4wobykuijSANhLfPehIXeM\"",
		"mtime": "2026-07-16T13:22:02.181Z",
		"size": 69901,
		"path": "../public/assets/SDIM7687_DxO-Ow4v2eE8.jpg"
	},
	"/assets/SDIM7698_DxO-B2HnpG8p.jpg": {
		"type": "image/jpeg",
		"etag": "\"60fb-Zq2vHw9d8pjtsXE07DG/Bz7W8To\"",
		"mtime": "2026-07-16T13:22:02.181Z",
		"size": 24827,
		"path": "../public/assets/SDIM7698_DxO-B2HnpG8p.jpg"
	},
	"/assets/SDIM7700_DxO-DK9D_z_U.jpg": {
		"type": "image/jpeg",
		"etag": "\"199bc-TlYBRgNHZgZWY9PYPXOKvQ3cK4k\"",
		"mtime": "2026-07-16T13:22:02.182Z",
		"size": 104892,
		"path": "../public/assets/SDIM7700_DxO-DK9D_z_U.jpg"
	},
	"/assets/SDIM7702_DxO-CglV9Df0.jpg": {
		"type": "image/jpeg",
		"etag": "\"b42c-aNy27jfV4xmusss1ZnlbyO+c3pI\"",
		"mtime": "2026-07-16T13:22:02.182Z",
		"size": 46124,
		"path": "../public/assets/SDIM7702_DxO-CglV9Df0.jpg"
	},
	"/assets/SDIM7723_DxO-CDa2GGxd.jpg": {
		"type": "image/jpeg",
		"etag": "\"9845-sscori4Ws6zP9Om0eUAXpJNF3QU\"",
		"mtime": "2026-07-16T13:22:02.182Z",
		"size": 38981,
		"path": "../public/assets/SDIM7723_DxO-CDa2GGxd.jpg"
	},
	"/assets/SDIM7706_DxO-BrvQr1hI.jpg": {
		"type": "image/jpeg",
		"etag": "\"1d3dd-5TcPq2IdxbdQtHH6h45LIE08l0M\"",
		"mtime": "2026-07-16T13:22:02.182Z",
		"size": 119773,
		"path": "../public/assets/SDIM7706_DxO-BrvQr1hI.jpg"
	},
	"/assets/SDIM7738_DxO-CbfGOVEM.jpg": {
		"type": "image/jpeg",
		"etag": "\"1bd43-EeOwdE88BrTvXfIKkZ2qGj5UQzQ\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 113987,
		"path": "../public/assets/SDIM7738_DxO-CbfGOVEM.jpg"
	},
	"/assets/SDIM7739_DxO-BSMWum8K.jpg": {
		"type": "image/jpeg",
		"etag": "\"6384-83y2kNR4kBBnMcuqtmRRCJhlwBM\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 25476,
		"path": "../public/assets/SDIM7739_DxO-BSMWum8K.jpg"
	},
	"/assets/SDIM7730_DxO-C0l7zjXy.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b160-jkU6zrVE9rKrWP0H39zwzhSvzew\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 110944,
		"path": "../public/assets/SDIM7730_DxO-C0l7zjXy.jpg"
	},
	"/assets/SDIM7745_DxO-B0LgpRyS.jpg": {
		"type": "image/jpeg",
		"etag": "\"f2fe-3+L6tsrG4YOnS1cyjf89CXNDXDg\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 62206,
		"path": "../public/assets/SDIM7745_DxO-B0LgpRyS.jpg"
	},
	"/assets/SDIM7803_DxO-CNjudPk_.jpg": {
		"type": "image/jpeg",
		"etag": "\"f131-r+HRB0EXjhxaz+67CwF364lMJdE\"",
		"mtime": "2026-07-16T13:22:02.184Z",
		"size": 61745,
		"path": "../public/assets/SDIM7803_DxO-CNjudPk_.jpg"
	},
	"/assets/SDIM7744_DxO-D-5njyUz.jpg": {
		"type": "image/jpeg",
		"etag": "\"bd7d-t0UMndwsH1pq4HiwWvTHJjRwO7w\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 48509,
		"path": "../public/assets/SDIM7744_DxO-D-5njyUz.jpg"
	},
	"/assets/SDIM7747_DxO-BqyqBEN2.jpg": {
		"type": "image/jpeg",
		"etag": "\"e522-emOdSzUu/cL5Dy5hdfvzt5RDsMY\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 58658,
		"path": "../public/assets/SDIM7747_DxO-BqyqBEN2.jpg"
	},
	"/assets/SDIM7749_DxO-HbtGq1VS.jpg": {
		"type": "image/jpeg",
		"etag": "\"1024c-ZqTcdlHgK5BrXMM8vcSupEa4GaY\"",
		"mtime": "2026-07-16T13:22:02.183Z",
		"size": 66124,
		"path": "../public/assets/SDIM7749_DxO-HbtGq1VS.jpg"
	},
	"/assets/SDIM7806_DxO-Bn07y2Yz.jpg": {
		"type": "image/jpeg",
		"etag": "\"c63d-s6RbJv8TNWOT1L/hwewUdDKlb0Y\"",
		"mtime": "2026-07-16T13:22:02.184Z",
		"size": 50749,
		"path": "../public/assets/SDIM7806_DxO-Bn07y2Yz.jpg"
	},
	"/assets/SDIM7807_DxO--1h9wU3S.jpg": {
		"type": "image/jpeg",
		"etag": "\"ad6c-+WiaIYuHmlZFTRBgngZ7Hn10IAg\"",
		"mtime": "2026-07-16T13:22:02.184Z",
		"size": 44396,
		"path": "../public/assets/SDIM7807_DxO--1h9wU3S.jpg"
	},
	"/assets/SDIM7819_DxO-Bge20YMj.jpg": {
		"type": "image/jpeg",
		"etag": "\"1133d-yt/6pY1lR4IAjkUaP/c/Fjs80Jo\"",
		"mtime": "2026-07-16T13:22:02.185Z",
		"size": 70461,
		"path": "../public/assets/SDIM7819_DxO-Bge20YMj.jpg"
	},
	"/assets/SDIM7816_DxO-CmU4d1Mv.jpg": {
		"type": "image/jpeg",
		"etag": "\"fd47-fhkmKZkHfSUXWsiBJMlmBZoFiLY\"",
		"mtime": "2026-07-16T13:22:02.185Z",
		"size": 64839,
		"path": "../public/assets/SDIM7816_DxO-CmU4d1Mv.jpg"
	},
	"/assets/SDIM7814_DxO-DRraIrbv.jpg": {
		"type": "image/jpeg",
		"etag": "\"109cc-FS+SAsbxYCClfMocQAEiXFfxuBk\"",
		"mtime": "2026-07-16T13:22:02.185Z",
		"size": 68044,
		"path": "../public/assets/SDIM7814_DxO-DRraIrbv.jpg"
	},
	"/assets/jsx-runtime-BnxRlLMJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20cf-o+JXTfz9TfARA0FtFP/gqBFIxVA\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 8399,
		"path": "../public/assets/jsx-runtime-BnxRlLMJ.js"
	},
	"/assets/SDIM7821_DxO-B6aD2kgq.jpg": {
		"type": "image/jpeg",
		"etag": "\"ec17-CUh6i8l/etxDoxHzfMjqQkbWga8\"",
		"mtime": "2026-07-16T13:22:02.186Z",
		"size": 60439,
		"path": "../public/assets/SDIM7821_DxO-B6aD2kgq.jpg"
	},
	"/assets/routes-CIJBBBg8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b1-bjU/unoGTIzG5LoSsHQjlTYHr0M\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 689,
		"path": "../public/assets/routes-CIJBBBg8.js"
	},
	"/assets/SDIM7824_DxO-CsXY8psX.jpg": {
		"type": "image/jpeg",
		"etag": "\"c4ad-nAH/LLjF57SBvFZhKXsna6s+3+Y\"",
		"mtime": "2026-07-16T13:22:02.187Z",
		"size": 50349,
		"path": "../public/assets/SDIM7824_DxO-CsXY8psX.jpg"
	},
	"/assets/photo-D8uzsNrl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d93-OR+yM695mC/KtCBzED3O0B0EASY\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 11667,
		"path": "../public/assets/photo-D8uzsNrl.js"
	},
	"/assets/main-Cngo3NgG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"674ee-HdssUD7qyuK9SBN/g+RzDoZPKeI\"",
		"mtime": "2026-07-16T13:22:02.163Z",
		"size": 423150,
		"path": "../public/assets/main-Cngo3NgG.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_0CiSEL = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_0CiSEL
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function createNitroApp() {
	const hooks = void 0;
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		{
			const routeRules = getRouteRules(method, pathname);
			event.context.routeRules = routeRules?.routeRules;
			if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		}
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260429-beta_rollup@4.60.0_vite@8.0.3_esbuild@0.27.4_tsx@4.21.0_yaml@2.8.3_/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
