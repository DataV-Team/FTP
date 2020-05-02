"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function getList(ftp, src) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    ftp.list(src, function (err, list) {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        else {
                            resolve(list);
                        }
                    });
                })];
        });
    });
}
exports.getList = getList;
function rmDir(ftp, src, recusive) {
    if (recusive === void 0) { recusive = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    ftp.rmdir(src, recusive, function (err) {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                })];
        });
    });
}
exports.rmDir = rmDir;
function deleteFile(ftp, src) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    ftp.delete(src, function (err) {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                })];
        });
    });
}
exports.deleteFile = deleteFile;
function emptyDir(ftp, src, except) {
    if (except === void 0) { except = []; }
    return __awaiter(this, void 0, void 0, function () {
        var list, _loop_1, i, listNum, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getList(ftp, src)];
                case 1:
                    list = _a.sent();
                    if (!list)
                        return [2 /*return*/, false];
                    _loop_1 = function (i, listNum) {
                        var _a, type, name_1, fullSrc;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = list[i], type = _a.type, name_1 = _a.name;
                                    if (type === 'd' && (name_1 === '.' || name_1 === '..'))
                                        return [2 /*return*/, "continue"];
                                    if (except.find(function (n) { return n === name_1; }))
                                        return [2 /*return*/, "continue"];
                                    fullSrc = "./" + name_1;
                                    if (!(type === 'd')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, rmDir(ftp, fullSrc, true)];
                                case 1:
                                    if (!(_b.sent()))
                                        return [2 /*return*/, { value: false }];
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, deleteFile(ftp, fullSrc)];
                                case 3:
                                    if (!(_b.sent()))
                                        return [2 /*return*/, { value: false }];
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0, listNum = list.length;
                    _a.label = 2;
                case 2:
                    if (!(i < listNum)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i, listNum)];
                case 3:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, true];
            }
        });
    });
}
exports.emptyDir = emptyDir;
function put(ftp, src, dest) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    ftp.put(src, dest, function (err) {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                })];
        });
    });
}
exports.put = put;
function mkDir(ftp, src, recusive) {
    if (recusive === void 0) { recusive = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    ftp.mkdir(src, recusive, function (err) {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                })];
        });
    });
}
exports.mkDir = mkDir;
