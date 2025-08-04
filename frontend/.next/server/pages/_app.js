/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./context/AuthContext.tsx":
/*!*********************************!*\
  !*** ./context/AuthContext.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [accessToken, setAccessToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [refreshToken, setRefreshToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Verificar se há token salvo no localStorage\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            const savedToken = localStorage.getItem('access_token');\n            const savedUser = localStorage.getItem('user');\n            if (savedToken && savedUser) {\n                try {\n                    const userData = JSON.parse(savedUser);\n                    setUser(userData);\n                    setAccessToken(savedToken);\n                    setRefreshToken(localStorage.getItem('refresh_token'));\n                } catch (error) {\n                    console.error('Erro ao carregar dados do usuário:', error);\n                    localStorage.removeItem('access_token');\n                    localStorage.removeItem('refresh_token');\n                    localStorage.removeItem('user');\n                }\n            }\n            setIsLoading(false);\n        }\n    }[\"AuthProvider.useEffect\"], []);\n    const login = async (email, password)=>{\n        try {\n            // Modo DEMO - Autenticação local\n            let userData;\n            if (email === 'admin@onion360.com' && password === 'admin123') {\n                userData = {\n                    id: 1,\n                    email: 'admin@onion360.com',\n                    full_name: 'Administrador Onion 360',\n                    is_active: true,\n                    permissions: [\n                        'admin',\n                        'user'\n                    ],\n                    created_at: new Date().toISOString(),\n                    last_login: new Date().toISOString()\n                };\n            } else if (email === 'demo@onionrsv.com' && password === 'demo123') {\n                userData = {\n                    id: 2,\n                    email: 'demo@onionrsv.com',\n                    full_name: 'Usuário Demo',\n                    is_active: true,\n                    permissions: [\n                        'admin'\n                    ],\n                    created_at: new Date().toISOString(),\n                    last_login: new Date().toISOString()\n                };\n            } else {\n                throw new Error('Credenciais inválidas');\n            }\n            // Salvar dados no localStorage\n            const token = `demo-token-${Date.now()}`;\n            const refreshToken = `demo-refresh-${Date.now()}`;\n            localStorage.setItem('access_token', token);\n            localStorage.setItem('refresh_token', refreshToken);\n            localStorage.setItem('user', JSON.stringify(userData));\n            setUser(userData);\n            setAccessToken(token);\n            setRefreshToken(refreshToken);\n            return true;\n        } catch (error) {\n            console.error('Erro no login:', error);\n            return false;\n        }\n    };\n    const logout = ()=>{\n        localStorage.removeItem('access_token');\n        localStorage.removeItem('refresh_token');\n        localStorage.removeItem('user');\n        setUser(null);\n        setAccessToken(null);\n        setRefreshToken(null);\n        router.push('/login');\n    };\n    const value = {\n        user,\n        isAuthenticated: !!user,\n        isLoading,\n        login,\n        logout,\n        accessToken,\n        refreshToken\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\context\\\\AuthContext.tsx\",\n        lineNumber: 128,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error('useAuth deve ser usado dentro de um AuthProvider');\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbnRleHQvQXV0aENvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUE4RTtBQUN0QztBQXNCeEMsTUFBTU0sNEJBQWNMLG9EQUFhQSxDQUE4Qk07QUFNeEQsU0FBU0MsYUFBYSxFQUFFQyxRQUFRLEVBQXFCO0lBQzFELE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHUiwrQ0FBUUEsQ0FBYztJQUM5QyxNQUFNLENBQUNTLFdBQVdDLGFBQWEsR0FBR1YsK0NBQVFBLENBQUM7SUFDM0MsTUFBTSxDQUFDVyxhQUFhQyxlQUFlLEdBQUdaLCtDQUFRQSxDQUFnQjtJQUM5RCxNQUFNLENBQUNhLGNBQWNDLGdCQUFnQixHQUFHZCwrQ0FBUUEsQ0FBZ0I7SUFDaEUsTUFBTWUsU0FBU2Isc0RBQVNBO0lBRXhCLDhDQUE4QztJQUM5Q0QsZ0RBQVNBO2tDQUFDO1lBQ1IsTUFBTWUsYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLE1BQU1DLFlBQVlGLGFBQWFDLE9BQU8sQ0FBQztZQUV2QyxJQUFJRixjQUFjRyxXQUFXO2dCQUMzQixJQUFJO29CQUNGLE1BQU1DLFdBQVdDLEtBQUtDLEtBQUssQ0FBQ0g7b0JBQzVCWCxRQUFRWTtvQkFDUlIsZUFBZUk7b0JBQ2ZGLGdCQUFnQkcsYUFBYUMsT0FBTyxDQUFDO2dCQUN2QyxFQUFFLE9BQU9LLE9BQU87b0JBQ2RDLFFBQVFELEtBQUssQ0FBQyxzQ0FBc0NBO29CQUNwRE4sYUFBYVEsVUFBVSxDQUFDO29CQUN4QlIsYUFBYVEsVUFBVSxDQUFDO29CQUN4QlIsYUFBYVEsVUFBVSxDQUFDO2dCQUMxQjtZQUNGO1lBRUFmLGFBQWE7UUFDZjtpQ0FBRyxFQUFFO0lBRUwsTUFBTWdCLFFBQVEsT0FBT0MsT0FBZUM7UUFDbEMsSUFBSTtZQUNGLGlDQUFpQztZQUNqQyxJQUFJUjtZQUVKLElBQUlPLFVBQVUsd0JBQXdCQyxhQUFhLFlBQVk7Z0JBQzdEUixXQUFXO29CQUNUUyxJQUFJO29CQUNKRixPQUFPO29CQUNQRyxXQUFXO29CQUNYQyxXQUFXO29CQUNYQyxhQUFhO3dCQUFDO3dCQUFTO3FCQUFPO29CQUM5QkMsWUFBWSxJQUFJQyxPQUFPQyxXQUFXO29CQUNsQ0MsWUFBWSxJQUFJRixPQUFPQyxXQUFXO2dCQUNwQztZQUNGLE9BQU8sSUFBSVIsVUFBVSx1QkFBdUJDLGFBQWEsV0FBVztnQkFDbEVSLFdBQVc7b0JBQ1RTLElBQUk7b0JBQ0pGLE9BQU87b0JBQ1BHLFdBQVc7b0JBQ1hDLFdBQVc7b0JBQ1hDLGFBQWE7d0JBQUM7cUJBQVE7b0JBQ3RCQyxZQUFZLElBQUlDLE9BQU9DLFdBQVc7b0JBQ2xDQyxZQUFZLElBQUlGLE9BQU9DLFdBQVc7Z0JBQ3BDO1lBQ0YsT0FBTztnQkFDTCxNQUFNLElBQUlFLE1BQU07WUFDbEI7WUFFQSwrQkFBK0I7WUFDL0IsTUFBTUMsUUFBUSxDQUFDLFdBQVcsRUFBRUosS0FBS0ssR0FBRyxJQUFJO1lBQ3hDLE1BQU0xQixlQUFlLENBQUMsYUFBYSxFQUFFcUIsS0FBS0ssR0FBRyxJQUFJO1lBRWpEdEIsYUFBYXVCLE9BQU8sQ0FBQyxnQkFBZ0JGO1lBQ3JDckIsYUFBYXVCLE9BQU8sQ0FBQyxpQkFBaUIzQjtZQUN0Q0ksYUFBYXVCLE9BQU8sQ0FBQyxRQUFRbkIsS0FBS29CLFNBQVMsQ0FBQ3JCO1lBRTVDWixRQUFRWTtZQUNSUixlQUFlMEI7WUFDZnhCLGdCQUFnQkQ7WUFFaEIsT0FBTztRQUNULEVBQUUsT0FBT1UsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsa0JBQWtCQTtZQUNoQyxPQUFPO1FBQ1Q7SUFDRjtJQUVBLE1BQU1tQixTQUFTO1FBQ2J6QixhQUFhUSxVQUFVLENBQUM7UUFDeEJSLGFBQWFRLFVBQVUsQ0FBQztRQUN4QlIsYUFBYVEsVUFBVSxDQUFDO1FBQ3hCakIsUUFBUTtRQUNSSSxlQUFlO1FBQ2ZFLGdCQUFnQjtRQUNoQkMsT0FBTzRCLElBQUksQ0FBQztJQUNkO0lBRUEsTUFBTUMsUUFBeUI7UUFDN0JyQztRQUNBc0MsaUJBQWlCLENBQUMsQ0FBQ3RDO1FBQ25CRTtRQUNBaUI7UUFDQWdCO1FBQ0EvQjtRQUNBRTtJQUNGO0lBRUEscUJBQ0UsOERBQUNWLFlBQVkyQyxRQUFRO1FBQUNGLE9BQU9BO2tCQUMxQnRDOzs7Ozs7QUFHUDtBQUVPLFNBQVN5QztJQUNkLE1BQU1DLFVBQVVqRCxpREFBVUEsQ0FBQ0k7SUFDM0IsSUFBSTZDLFlBQVk1QyxXQUFXO1FBQ3pCLE1BQU0sSUFBSWlDLE1BQU07SUFDbEI7SUFDQSxPQUFPVztBQUNUIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFJTVlxcRGVza3RvcFxcc2Vydmlkb3IgUlNWXFxmcm9udGVuZFxcY29udGV4dFxcQXV0aENvbnRleHQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XHJcblxyXG5pbnRlcmZhY2UgVXNlciB7XHJcbiAgaWQ6IG51bWJlcjtcclxuICBlbWFpbDogc3RyaW5nO1xyXG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xyXG4gIGlzX2FjdGl2ZTogYm9vbGVhbjtcclxuICBwZXJtaXNzaW9uczogc3RyaW5nW107XHJcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xyXG4gIGxhc3RfbG9naW4/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBBdXRoQ29udGV4dFR5cGUge1xyXG4gIHVzZXI6IFVzZXIgfCBudWxsO1xyXG4gIGlzQXV0aGVudGljYXRlZDogYm9vbGVhbjtcclxuICBpc0xvYWRpbmc6IGJvb2xlYW47XHJcbiAgbG9naW46IChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xyXG4gIGxvZ291dDogKCkgPT4gdm9pZDtcclxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbDtcclxuICByZWZyZXNoVG9rZW46IHN0cmluZyB8IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFR5cGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XHJcblxyXG5pbnRlcmZhY2UgQXV0aFByb3ZpZGVyUHJvcHMge1xyXG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiBBdXRoUHJvdmlkZXJQcm9wcykge1xyXG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXIgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2FjY2Vzc1Rva2VuLCBzZXRBY2Nlc3NUb2tlbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbcmVmcmVzaFRva2VuLCBzZXRSZWZyZXNoVG9rZW5dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcblxyXG4gIC8vIFZlcmlmaWNhciBzZSBow6EgdG9rZW4gc2Fsdm8gbm8gbG9jYWxTdG9yYWdlXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHNhdmVkVG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjZXNzX3Rva2VuJyk7XHJcbiAgICBjb25zdCBzYXZlZFVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgXHJcbiAgICBpZiAoc2F2ZWRUb2tlbiAmJiBzYXZlZFVzZXIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB1c2VyRGF0YSA9IEpTT04ucGFyc2Uoc2F2ZWRVc2VyKTtcclxuICAgICAgICBzZXRVc2VyKHVzZXJEYXRhKTtcclxuICAgICAgICBzZXRBY2Nlc3NUb2tlbihzYXZlZFRva2VuKTtcclxuICAgICAgICBzZXRSZWZyZXNoVG9rZW4obG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nKSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJybyBhbyBjYXJyZWdhciBkYWRvcyBkbyB1c3XDoXJpbzonLCBlcnJvcik7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY2Vzc190b2tlbicpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyZWZyZXNoX3Rva2VuJyk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgbG9naW4gPSBhc3luYyAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gTW9kbyBERU1PIC0gQXV0ZW50aWNhw6fDo28gbG9jYWxcclxuICAgICAgbGV0IHVzZXJEYXRhOiBVc2VyO1xyXG4gICAgICBcclxuICAgICAgaWYgKGVtYWlsID09PSAnYWRtaW5Ab25pb24zNjAuY29tJyAmJiBwYXNzd29yZCA9PT0gJ2FkbWluMTIzJykge1xyXG4gICAgICAgIHVzZXJEYXRhID0ge1xyXG4gICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICBlbWFpbDogJ2FkbWluQG9uaW9uMzYwLmNvbScsXHJcbiAgICAgICAgICBmdWxsX25hbWU6ICdBZG1pbmlzdHJhZG9yIE9uaW9uIDM2MCcsXHJcbiAgICAgICAgICBpc19hY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICBwZXJtaXNzaW9uczogWydhZG1pbicsICd1c2VyJ10sXHJcbiAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgICBsYXN0X2xvZ2luOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2UgaWYgKGVtYWlsID09PSAnZGVtb0BvbmlvbnJzdi5jb20nICYmIHBhc3N3b3JkID09PSAnZGVtbzEyMycpIHtcclxuICAgICAgICB1c2VyRGF0YSA9IHtcclxuICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgZW1haWw6ICdkZW1vQG9uaW9ucnN2LmNvbScsXHJcbiAgICAgICAgICBmdWxsX25hbWU6ICdVc3XDoXJpbyBEZW1vJyxcclxuICAgICAgICAgIGlzX2FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgIHBlcm1pc3Npb25zOiBbJ2FkbWluJ10sXHJcbiAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgICBsYXN0X2xvZ2luOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3JlZGVuY2lhaXMgaW52w6FsaWRhcycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTYWx2YXIgZGFkb3Mgbm8gbG9jYWxTdG9yYWdlXHJcbiAgICAgIGNvbnN0IHRva2VuID0gYGRlbW8tdG9rZW4tJHtEYXRlLm5vdygpfWA7XHJcbiAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IGBkZW1vLXJlZnJlc2gtJHtEYXRlLm5vdygpfWA7XHJcbiAgICAgIFxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjZXNzX3Rva2VuJywgdG9rZW4pO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hUb2tlbik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcclxuICAgICAgXHJcbiAgICAgIHNldFVzZXIodXNlckRhdGEpO1xyXG4gICAgICBzZXRBY2Nlc3NUb2tlbih0b2tlbik7XHJcbiAgICAgIHNldFJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvIG5vIGxvZ2luOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2Nlc3NfdG9rZW4nKTtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyZWZyZXNoX3Rva2VuJyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpO1xyXG4gICAgc2V0VXNlcihudWxsKTtcclxuICAgIHNldEFjY2Vzc1Rva2VuKG51bGwpO1xyXG4gICAgc2V0UmVmcmVzaFRva2VuKG51bGwpO1xyXG4gICAgcm91dGVyLnB1c2goJy9sb2dpbicpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHZhbHVlOiBBdXRoQ29udGV4dFR5cGUgPSB7XHJcbiAgICB1c2VyLFxyXG4gICAgaXNBdXRoZW50aWNhdGVkOiAhIXVzZXIsXHJcbiAgICBpc0xvYWRpbmcsXHJcbiAgICBsb2dpbixcclxuICAgIGxvZ291dCxcclxuICAgIGFjY2Vzc1Rva2VuLFxyXG4gICAgcmVmcmVzaFRva2VuXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcclxuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGggZGV2ZSBzZXIgdXNhZG8gZGVudHJvIGRlIHVtIEF1dGhQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dDtcclxufSAiXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiQXV0aENvbnRleHQiLCJ1bmRlZmluZWQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwiYWNjZXNzVG9rZW4iLCJzZXRBY2Nlc3NUb2tlbiIsInJlZnJlc2hUb2tlbiIsInNldFJlZnJlc2hUb2tlbiIsInJvdXRlciIsInNhdmVkVG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2F2ZWRVc2VyIiwidXNlckRhdGEiLCJKU09OIiwicGFyc2UiLCJlcnJvciIsImNvbnNvbGUiLCJyZW1vdmVJdGVtIiwibG9naW4iLCJlbWFpbCIsInBhc3N3b3JkIiwiaWQiLCJmdWxsX25hbWUiLCJpc19hY3RpdmUiLCJwZXJtaXNzaW9ucyIsImNyZWF0ZWRfYXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJsYXN0X2xvZ2luIiwiRXJyb3IiLCJ0b2tlbiIsIm5vdyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJsb2dvdXQiLCJwdXNoIiwidmFsdWUiLCJpc0F1dGhlbnRpY2F0ZWQiLCJQcm92aWRlciIsInVzZUF1dGgiLCJjb250ZXh0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./context/AuthContext.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AuthContext */ \"(pages-dir-node)/./context/AuthContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                        lineNumber: 10,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Onion RSV 360 - Sistema de Turismo\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                        lineNumber: 11,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Sistema completo de gest\\xe3o tur\\xedstica Onion RSV 360\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                        lineNumber: 12,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                    lineNumber: 15,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\RSV\\\\Desktop\\\\servidor RSV\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNxRDtBQUN2QjtBQUNGO0FBRWIsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRTs7MEJBQ0UsOERBQUNILGtEQUFJQTs7a0NBQ0gsOERBQUNJO3dCQUFLQyxNQUFLO3dCQUFXQyxTQUFROzs7Ozs7a0NBQzlCLDhEQUFDQztrQ0FBTTs7Ozs7O2tDQUNQLDhEQUFDSDt3QkFBS0MsTUFBSzt3QkFBY0MsU0FBUTs7Ozs7Ozs7Ozs7OzBCQUVuQyw4REFBQ1AsOERBQVlBOzBCQUNYLDRFQUFDRztvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFJTVlxcRGVza3RvcFxcc2Vydmlkb3IgUlNWXFxmcm9udGVuZFxccGFnZXNcXF9hcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcclxuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dCdcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXHJcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDw+XHJcbiAgICAgIDxIZWFkPlxyXG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XHJcbiAgICAgICAgPHRpdGxlPk9uaW9uIFJTViAzNjAgLSBTaXN0ZW1hIGRlIFR1cmlzbW88L3RpdGxlPlxyXG4gICAgICAgIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJTaXN0ZW1hIGNvbXBsZXRvIGRlIGdlc3TDo28gdHVyw61zdGljYSBPbmlvbiBSU1YgMzYwXCIgLz5cclxuICAgICAgPC9IZWFkPlxyXG4gICAgICA8QXV0aFByb3ZpZGVyPlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgPC9BdXRoUHJvdmlkZXI+XHJcbiAgICA8Lz5cclxuICApXHJcbn0gIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIkhlYWQiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtZXRhIiwibmFtZSIsImNvbnRlbnQiLCJ0aXRsZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();