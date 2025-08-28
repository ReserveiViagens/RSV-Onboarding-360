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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [accessToken, setAccessToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [refreshToken, setRefreshToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Verificar se há token salvo no localStorage\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            const savedToken = localStorage.getItem('access_token');\n            const savedUser = localStorage.getItem('user');\n            if (savedToken && savedUser) {\n                try {\n                    const userData = JSON.parse(savedUser);\n                    setUser(userData);\n                    setAccessToken(savedToken);\n                    setRefreshToken(localStorage.getItem('refresh_token'));\n                } catch (error) {\n                    console.error('Erro ao carregar dados do usuário:', error);\n                    localStorage.removeItem('access_token');\n                    localStorage.removeItem('refresh_token');\n                    localStorage.removeItem('user');\n                }\n            }\n            setIsLoading(false);\n        }\n    }[\"AuthProvider.useEffect\"], []);\n    const login = async (email, password)=>{\n        try {\n            // Modo DEMO - Autenticação local\n            let userData;\n            if (email === 'admin@onion360.com' && password === 'admin123') {\n                userData = {\n                    id: 1,\n                    email: 'admin@onion360.com',\n                    full_name: 'Administrador Onion 360',\n                    is_active: true,\n                    permissions: [\n                        'admin',\n                        'user'\n                    ],\n                    created_at: new Date().toISOString(),\n                    last_login: new Date().toISOString()\n                };\n            } else if (email === 'demo@onionrsv.com' && password === 'demo123') {\n                userData = {\n                    id: 2,\n                    email: 'demo@onionrsv.com',\n                    full_name: 'Usuário Demo',\n                    is_active: true,\n                    permissions: [\n                        'admin'\n                    ],\n                    created_at: new Date().toISOString(),\n                    last_login: new Date().toISOString()\n                };\n            } else {\n                throw new Error('Credenciais inválidas');\n            }\n            // Salvar dados no localStorage\n            const token = `demo-token-${Date.now()}`;\n            const refreshToken = `demo-refresh-${Date.now()}`;\n            localStorage.setItem('access_token', token);\n            localStorage.setItem('refresh_token', refreshToken);\n            localStorage.setItem('user', JSON.stringify(userData));\n            setUser(userData);\n            setAccessToken(token);\n            setRefreshToken(refreshToken);\n            return true;\n        } catch (error) {\n            console.error('Erro no login:', error);\n            return false;\n        }\n    };\n    const logout = ()=>{\n        localStorage.removeItem('access_token');\n        localStorage.removeItem('refresh_token');\n        localStorage.removeItem('user');\n        setUser(null);\n        setAccessToken(null);\n        setRefreshToken(null);\n        router.push('/login');\n    };\n    const value = {\n        user,\n        isAuthenticated: !!user,\n        isLoading,\n        login,\n        logout,\n        accessToken,\n        refreshToken\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/workspace/frontend/context/AuthContext.tsx\",\n        lineNumber: 128,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error('useAuth deve ser usado dentro de um AuthProvider');\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbnRleHQvQXV0aENvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUE4RTtBQUN0QztBQXNCeEMsTUFBTU0sNEJBQWNMLG9EQUFhQSxDQUE4Qk07QUFNeEQsU0FBU0MsYUFBYSxFQUFFQyxRQUFRLEVBQXFCO0lBQzFELE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHUiwrQ0FBUUEsQ0FBYztJQUM5QyxNQUFNLENBQUNTLFdBQVdDLGFBQWEsR0FBR1YsK0NBQVFBLENBQUM7SUFDM0MsTUFBTSxDQUFDVyxhQUFhQyxlQUFlLEdBQUdaLCtDQUFRQSxDQUFnQjtJQUM5RCxNQUFNLENBQUNhLGNBQWNDLGdCQUFnQixHQUFHZCwrQ0FBUUEsQ0FBZ0I7SUFDaEUsTUFBTWUsU0FBU2Isc0RBQVNBO0lBRXhCLDhDQUE4QztJQUM5Q0QsZ0RBQVNBO2tDQUFDO1lBQ1IsTUFBTWUsYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLE1BQU1DLFlBQVlGLGFBQWFDLE9BQU8sQ0FBQztZQUV2QyxJQUFJRixjQUFjRyxXQUFXO2dCQUMzQixJQUFJO29CQUNGLE1BQU1DLFdBQVdDLEtBQUtDLEtBQUssQ0FBQ0g7b0JBQzVCWCxRQUFRWTtvQkFDUlIsZUFBZUk7b0JBQ2ZGLGdCQUFnQkcsYUFBYUMsT0FBTyxDQUFDO2dCQUN2QyxFQUFFLE9BQU9LLE9BQU87b0JBQ2RDLFFBQVFELEtBQUssQ0FBQyxzQ0FBc0NBO29CQUNwRE4sYUFBYVEsVUFBVSxDQUFDO29CQUN4QlIsYUFBYVEsVUFBVSxDQUFDO29CQUN4QlIsYUFBYVEsVUFBVSxDQUFDO2dCQUMxQjtZQUNGO1lBRUFmLGFBQWE7UUFDZjtpQ0FBRyxFQUFFO0lBRUwsTUFBTWdCLFFBQVEsT0FBT0MsT0FBZUM7UUFDbEMsSUFBSTtZQUNGLGlDQUFpQztZQUNqQyxJQUFJUjtZQUVKLElBQUlPLFVBQVUsd0JBQXdCQyxhQUFhLFlBQVk7Z0JBQzdEUixXQUFXO29CQUNUUyxJQUFJO29CQUNKRixPQUFPO29CQUNQRyxXQUFXO29CQUNYQyxXQUFXO29CQUNYQyxhQUFhO3dCQUFDO3dCQUFTO3FCQUFPO29CQUM5QkMsWUFBWSxJQUFJQyxPQUFPQyxXQUFXO29CQUNsQ0MsWUFBWSxJQUFJRixPQUFPQyxXQUFXO2dCQUNwQztZQUNGLE9BQU8sSUFBSVIsVUFBVSx1QkFBdUJDLGFBQWEsV0FBVztnQkFDbEVSLFdBQVc7b0JBQ1RTLElBQUk7b0JBQ0pGLE9BQU87b0JBQ1BHLFdBQVc7b0JBQ1hDLFdBQVc7b0JBQ1hDLGFBQWE7d0JBQUM7cUJBQVE7b0JBQ3RCQyxZQUFZLElBQUlDLE9BQU9DLFdBQVc7b0JBQ2xDQyxZQUFZLElBQUlGLE9BQU9DLFdBQVc7Z0JBQ3BDO1lBQ0YsT0FBTztnQkFDTCxNQUFNLElBQUlFLE1BQU07WUFDbEI7WUFFQSwrQkFBK0I7WUFDL0IsTUFBTUMsUUFBUSxDQUFDLFdBQVcsRUFBRUosS0FBS0ssR0FBRyxJQUFJO1lBQ3hDLE1BQU0xQixlQUFlLENBQUMsYUFBYSxFQUFFcUIsS0FBS0ssR0FBRyxJQUFJO1lBRWpEdEIsYUFBYXVCLE9BQU8sQ0FBQyxnQkFBZ0JGO1lBQ3JDckIsYUFBYXVCLE9BQU8sQ0FBQyxpQkFBaUIzQjtZQUN0Q0ksYUFBYXVCLE9BQU8sQ0FBQyxRQUFRbkIsS0FBS29CLFNBQVMsQ0FBQ3JCO1lBRTVDWixRQUFRWTtZQUNSUixlQUFlMEI7WUFDZnhCLGdCQUFnQkQ7WUFFaEIsT0FBTztRQUNULEVBQUUsT0FBT1UsT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsa0JBQWtCQTtZQUNoQyxPQUFPO1FBQ1Q7SUFDRjtJQUVBLE1BQU1tQixTQUFTO1FBQ2J6QixhQUFhUSxVQUFVLENBQUM7UUFDeEJSLGFBQWFRLFVBQVUsQ0FBQztRQUN4QlIsYUFBYVEsVUFBVSxDQUFDO1FBQ3hCakIsUUFBUTtRQUNSSSxlQUFlO1FBQ2ZFLGdCQUFnQjtRQUNoQkMsT0FBTzRCLElBQUksQ0FBQztJQUNkO0lBRUEsTUFBTUMsUUFBeUI7UUFDN0JyQztRQUNBc0MsaUJBQWlCLENBQUMsQ0FBQ3RDO1FBQ25CRTtRQUNBaUI7UUFDQWdCO1FBQ0EvQjtRQUNBRTtJQUNGO0lBRUEscUJBQ0UsOERBQUNWLFlBQVkyQyxRQUFRO1FBQUNGLE9BQU9BO2tCQUMxQnRDOzs7Ozs7QUFHUDtBQUVPLFNBQVN5QztJQUNkLE1BQU1DLFVBQVVqRCxpREFBVUEsQ0FBQ0k7SUFDM0IsSUFBSTZDLFlBQVk1QyxXQUFXO1FBQ3pCLE1BQU0sSUFBSWlDLE1BQU07SUFDbEI7SUFDQSxPQUFPVztBQUNUIiwic291cmNlcyI6WyIvd29ya3NwYWNlL2Zyb250ZW5kL2NvbnRleHQvQXV0aENvbnRleHQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuXG5pbnRlcmZhY2UgVXNlciB7XG4gIGlkOiBudW1iZXI7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZ1bGxfbmFtZTogc3RyaW5nO1xuICBpc19hY3RpdmU6IGJvb2xlYW47XG4gIHBlcm1pc3Npb25zOiBzdHJpbmdbXTtcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xuICBsYXN0X2xvZ2luPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQXV0aENvbnRleHRUeXBlIHtcbiAgdXNlcjogVXNlciB8IG51bGw7XG4gIGlzQXV0aGVudGljYXRlZDogYm9vbGVhbjtcbiAgaXNMb2FkaW5nOiBib29sZWFuO1xuICBsb2dpbjogKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj47XG4gIGxvZ291dDogKCkgPT4gdm9pZDtcbiAgYWNjZXNzVG9rZW46IHN0cmluZyB8IG51bGw7XG4gIHJlZnJlc2hUb2tlbjogc3RyaW5nIHwgbnVsbDtcbn1cblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuaW50ZXJmYWNlIEF1dGhQcm92aWRlclByb3BzIHtcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcih7IGNoaWxkcmVuIH06IEF1dGhQcm92aWRlclByb3BzKSB7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbYWNjZXNzVG9rZW4sIHNldEFjY2Vzc1Rva2VuXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbcmVmcmVzaFRva2VuLCBzZXRSZWZyZXNoVG9rZW5dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIC8vIFZlcmlmaWNhciBzZSBow6EgdG9rZW4gc2Fsdm8gbm8gbG9jYWxTdG9yYWdlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc2F2ZWRUb2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3NfdG9rZW4nKTtcbiAgICBjb25zdCBzYXZlZFVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xuICAgIFxuICAgIGlmIChzYXZlZFRva2VuICYmIHNhdmVkVXNlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSBKU09OLnBhcnNlKHNhdmVkVXNlcik7XG4gICAgICAgIHNldFVzZXIodXNlckRhdGEpO1xuICAgICAgICBzZXRBY2Nlc3NUb2tlbihzYXZlZFRva2VuKTtcbiAgICAgICAgc2V0UmVmcmVzaFRva2VuKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJybyBhbyBjYXJyZWdhciBkYWRvcyBkbyB1c3XDoXJpbzonLCBlcnJvcik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2Nlc3NfdG9rZW4nKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGxvZ2luID0gYXN5bmMgKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gTW9kbyBERU1PIC0gQXV0ZW50aWNhw6fDo28gbG9jYWxcbiAgICAgIGxldCB1c2VyRGF0YTogVXNlcjtcbiAgICAgIFxuICAgICAgaWYgKGVtYWlsID09PSAnYWRtaW5Ab25pb24zNjAuY29tJyAmJiBwYXNzd29yZCA9PT0gJ2FkbWluMTIzJykge1xuICAgICAgICB1c2VyRGF0YSA9IHtcbiAgICAgICAgICBpZDogMSxcbiAgICAgICAgICBlbWFpbDogJ2FkbWluQG9uaW9uMzYwLmNvbScsXG4gICAgICAgICAgZnVsbF9uYW1lOiAnQWRtaW5pc3RyYWRvciBPbmlvbiAzNjAnLFxuICAgICAgICAgIGlzX2FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICBwZXJtaXNzaW9uczogWydhZG1pbicsICd1c2VyJ10sXG4gICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIGxhc3RfbG9naW46IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChlbWFpbCA9PT0gJ2RlbW9Ab25pb25yc3YuY29tJyAmJiBwYXNzd29yZCA9PT0gJ2RlbW8xMjMnKSB7XG4gICAgICAgIHVzZXJEYXRhID0ge1xuICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgIGVtYWlsOiAnZGVtb0BvbmlvbnJzdi5jb20nLFxuICAgICAgICAgIGZ1bGxfbmFtZTogJ1VzdcOhcmlvIERlbW8nLFxuICAgICAgICAgIGlzX2FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICBwZXJtaXNzaW9uczogWydhZG1pbiddLFxuICAgICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICBsYXN0X2xvZ2luOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3JlZGVuY2lhaXMgaW52w6FsaWRhcycpO1xuICAgICAgfVxuXG4gICAgICAvLyBTYWx2YXIgZGFkb3Mgbm8gbG9jYWxTdG9yYWdlXG4gICAgICBjb25zdCB0b2tlbiA9IGBkZW1vLXRva2VuLSR7RGF0ZS5ub3coKX1gO1xuICAgICAgY29uc3QgcmVmcmVzaFRva2VuID0gYGRlbW8tcmVmcmVzaC0ke0RhdGUubm93KCl9YDtcbiAgICAgIFxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY2Vzc190b2tlbicsIHRva2VuKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaFRva2VuKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcbiAgICAgIFxuICAgICAgc2V0VXNlcih1c2VyRGF0YSk7XG4gICAgICBzZXRBY2Nlc3NUb2tlbih0b2tlbik7XG4gICAgICBzZXRSZWZyZXNoVG9rZW4ocmVmcmVzaFRva2VuKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm8gbm8gbG9naW46JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY2Vzc190b2tlbicpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyZWZyZXNoX3Rva2VuJyk7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICBzZXRVc2VyKG51bGwpO1xuICAgIHNldEFjY2Vzc1Rva2VuKG51bGwpO1xuICAgIHNldFJlZnJlc2hUb2tlbihudWxsKTtcbiAgICByb3V0ZXIucHVzaCgnL2xvZ2luJyk7XG4gIH07XG5cbiAgY29uc3QgdmFsdWU6IEF1dGhDb250ZXh0VHlwZSA9IHtcbiAgICB1c2VyLFxuICAgIGlzQXV0aGVudGljYXRlZDogISF1c2VyLFxuICAgIGlzTG9hZGluZyxcbiAgICBsb2dpbixcbiAgICBsb2dvdXQsXG4gICAgYWNjZXNzVG9rZW4sXG4gICAgcmVmcmVzaFRva2VuXG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIGRldmUgc2VyIHVzYWRvIGRlbnRybyBkZSB1bSBBdXRoUHJvdmlkZXInKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn0gIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZVJvdXRlciIsIkF1dGhDb250ZXh0IiwidW5kZWZpbmVkIiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VyIiwic2V0VXNlciIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsImFjY2Vzc1Rva2VuIiwic2V0QWNjZXNzVG9rZW4iLCJyZWZyZXNoVG9rZW4iLCJzZXRSZWZyZXNoVG9rZW4iLCJyb3V0ZXIiLCJzYXZlZFRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNhdmVkVXNlciIsInVzZXJEYXRhIiwiSlNPTiIsInBhcnNlIiwiZXJyb3IiLCJjb25zb2xlIiwicmVtb3ZlSXRlbSIsImxvZ2luIiwiZW1haWwiLCJwYXNzd29yZCIsImlkIiwiZnVsbF9uYW1lIiwiaXNfYWN0aXZlIiwicGVybWlzc2lvbnMiLCJjcmVhdGVkX2F0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwibGFzdF9sb2dpbiIsIkVycm9yIiwidG9rZW4iLCJub3ciLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwibG9nb3V0IiwicHVzaCIsInZhbHVlIiwiaXNBdXRoZW50aWNhdGVkIiwiUHJvdmlkZXIiLCJ1c2VBdXRoIiwiY29udGV4dCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./context/AuthContext.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/AuthContext */ \"(pages-dir-node)/./context/AuthContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"(pages-dir-node)/./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/workspace/frontend/pages/_app.tsx\",\n                        lineNumber: 10,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"Onion RSV 360 - Sistema de Turismo\"\n                    }, void 0, false, {\n                        fileName: \"/workspace/frontend/pages/_app.tsx\",\n                        lineNumber: 11,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Sistema completo de gest\\xe3o tur\\xedstica Onion RSV 360\"\n                    }, void 0, false, {\n                        fileName: \"/workspace/frontend/pages/_app.tsx\",\n                        lineNumber: 12,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/workspace/frontend/pages/_app.tsx\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_1__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/workspace/frontend/pages/_app.tsx\",\n                    lineNumber: 15,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/workspace/frontend/pages/_app.tsx\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNxRDtBQUN2QjtBQUNGO0FBRWIsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRTs7MEJBQ0UsOERBQUNILGtEQUFJQTs7a0NBQ0gsOERBQUNJO3dCQUFLQyxNQUFLO3dCQUFXQyxTQUFROzs7Ozs7a0NBQzlCLDhEQUFDQztrQ0FBTTs7Ozs7O2tDQUNQLDhEQUFDSDt3QkFBS0MsTUFBSzt3QkFBY0MsU0FBUTs7Ozs7Ozs7Ozs7OzBCQUVuQyw4REFBQ1AsOERBQVlBOzBCQUNYLDRFQUFDRztvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyIvd29ya3NwYWNlL2Zyb250ZW5kL3BhZ2VzL19hcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHQvQXV0aENvbnRleHQnXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEhlYWQ+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICAgIDx0aXRsZT5PbmlvbiBSU1YgMzYwIC0gU2lzdGVtYSBkZSBUdXJpc21vPC90aXRsZT5cbiAgICAgICAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIlNpc3RlbWEgY29tcGxldG8gZGUgZ2VzdMOjbyB0dXLDrXN0aWNhIE9uaW9uIFJTViAzNjBcIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgPEF1dGhQcm92aWRlcj5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgPC8+XG4gIClcbn0gIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIkhlYWQiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtZXRhIiwibmFtZSIsImNvbnRlbnQiLCJ0aXRsZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

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