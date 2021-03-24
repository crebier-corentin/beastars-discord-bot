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
exports.__esModule = true;
exports.ChapterPGCommand = exports.ChapterBCVCommand = exports.ChapterBCRCommand = exports.ChapterBCGCommand = exports.ChapterBSVCommand = exports.ChapterBSRCommand = exports.ChapterBSDGCommand = exports.ChapterBSGCommand = exports.ChapterBSDCommand = exports.ChapterBCCommand = exports.ChapterBSCommand = void 0;
var Mangadex_1 = require("../ExternalApi/Mangadex");
var types_1 = require("../types");
var GoogleDrive_1 = require("../ExternalApi/GoogleDrive");
var FileDownloader_1 = require("../FileDownloader");
var nonSpoilerChannels = new Set(process.env.NON_SPOILER_CHANNELS.split(","));
var mangadex = new Mangadex_1.MangadexWithCache();
var chapterCommandExecute = function (msg, args, manga, group) {
    if (group === void 0) { group = null; }
    return __awaiter(this, void 0, void 0, function () {
        var chapter, page, response, isSpoiler, file, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    chapter = Number(args[0]);
                    //Missing chapter number
                    if (Number.isNaN(chapter)) {
                        throw new types_1.CommandError("Missing [chapter]\n`" + this.usage + "`");
                    }
                    if (!(args.length >= 2)) return [3 /*break*/, 6];
                    page = Number(args[1]);
                    if (Number.isNaN(page)) {
                        throw new types_1.CommandError("Invalid [page] (must be a number)\n`" + this.usage + "`");
                    }
                    return [4 /*yield*/, mangadex.getChapterPageLink(chapter, page, manga, group)];
                case 1:
                    response = _d.sent();
                    isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
                    if (!isSpoiler) return [3 /*break*/, 3];
                    return [4 /*yield*/, FileDownloader_1.FileDownloader.Download(response.image, "SPOILER_")];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = response.image;
                    _d.label = 4;
                case 4:
                    file = _a;
                    //Site link + Image link
                    return [4 /*yield*/, msg.channel.send("<" + response.site + ">", { files: [file] })];
                case 5:
                    //Site link + Image link
                    _d.sent();
                    return [3 /*break*/, 8];
                case 6:
                    //Chapter link
                    _c = (_b = msg.channel).send;
                    return [4 /*yield*/, mangadex.getChapterLink(chapter, manga, group)];
                case 7:
                    //Chapter link
                    _c.apply(_b, [_d.sent()]);
                    _d.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.ChapterBSCommand = {
    name: "bs!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bs! [chapter] (page)",
    example: "bs! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
exports.ChapterBCCommand = {
    name: "bc!",
    desc: "Send link to Beast Complex chapter Nº[chapter] or post page Nº(page) from chapter [chapter]",
    usage: "bc! [chapter] (page)",
    example: "bc! 2",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chapterCommandExecute.call(this, msg, args, types_1.Manga.BeastComplex)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Discord
exports.ChapterBSDCommand = {
    name: "bsd!",
    desc: "Send link to Beastars chapter Nº[chapter] or post page Nº(page) from chapter [chapter] (Beastars Discord translation)",
    usage: "bsd! [chapter] (page)",
    example: "bsd! 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chapterCommandExecute.call(this, msg, args, types_1.Manga.Beastars, "Hybridgumi")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Drive//
var drive = new GoogleDrive_1.GoogleDriveWithCache();
function googleDriveChapterCommandExecute(msg, args, driveId) {
    return __awaiter(this, void 0, void 0, function () {
        var chapter, page, link, isSpoiler, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    chapter = Number(args[0]);
                    page = Number(args[1]);
                    //Missing chapter
                    if (Number.isNaN(chapter)) {
                        throw new types_1.CommandError("Missing [chapter]\n`" + this.usage + "`");
                    }
                    //Missing page
                    if (Number.isNaN(page)) {
                        throw new types_1.CommandError("Missing [page]\n`" + this.usage + "`");
                    }
                    return [4 /*yield*/, drive.getPageLink(driveId, chapter, page)];
                case 1:
                    link = _d.sent();
                    isSpoiler = !nonSpoilerChannels.has(msg.channel.id);
                    _b = (_a = msg.channel).send;
                    _c = {};
                    return [4 /*yield*/, FileDownloader_1.FileDownloader.Download(link, isSpoiler ? "SPOILER_" : "")];
                case 2: 
                //Download file
                return [4 /*yield*/, _b.apply(_a, [(_c.files = [_d.sent()], _c)])];
                case 3:
                    //Download file
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//Beastars Drive HCS
exports.ChapterBSGCommand = {
    name: "bsg!",
    desc: "Post page Nº(page) from chapter (chapter) HCS translation from Google Drive",
    usage: "bsg! (chapter) (page)",
    example: "bsg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_HCS_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beastars Drive Discord
exports.ChapterBSDGCommand = {
    name: "bsdg!",
    desc: "Post page Nº(page) from chapter (chapter) Beastars Discord translation translation from Google Drive",
    usage: "bsdg! (chapter) (page)",
    example: "bsdg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_DISCORD_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beastars Raw
exports.ChapterBSRCommand = {
    name: "bsr!",
    desc: "Post page Nº(page) from chapter (chapter)",
    usage: "bsr! (chapter) (page)",
    example: "bsr! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beastars Viz
exports.ChapterBSVCommand = {
    name: "bsv!",
    desc: "Post page Nº(page) from chapter (chapter) Viz translation",
    usage: "bsv! (chapter) (page)",
    example: "bsv! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEASTARS_VIZ_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beast Complex Drive
exports.ChapterBCGCommand = {
    name: "bcg!",
    desc: "Post page Nº(page) from chapter (chapter) (Beast Complex) from Google Drive",
    usage: "bcg! (chapter) (page)",
    example: "bcg! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beast Complex Raw
exports.ChapterBCRCommand = {
    name: "bcr!",
    desc: "Post page Nº(page) from chapter (chapter) (Beast Complex)",
    usage: "bcr! (chapter) (page)",
    example: "bcr! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_RAW_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Beast Complex Viz
exports.ChapterBCVCommand = {
    name: "bcv!",
    desc: "Post page Nº(page) from chapter (chapter) Viz translation (Beast Complex)",
    usage: "bcv! (chapter) (page)",
    example: "bcv! 1 10",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, googleDriveChapterCommandExecute.call(this, msg, args, process.env.DRIVE_BEAST_COMPLEX_VIZ_FOLDER_ID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//Paru's Graffiti
exports.ChapterPGCommand = {
    name: "pg!",
    desc: "Post page Nº(page) from chapter (chapter) of Paru's Graffiti",
    usage: "pg! (chapter) (page)",
    example: "pg! 1 3",
    useDefaultPrefix: false,
    adminOnly: false,
    execute: function (msg, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chapterCommandExecute.call(this, msg, args, types_1.Manga.ParusGraffiti)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
