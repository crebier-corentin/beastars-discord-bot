"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandError = exports.Manga = void 0;
var Manga;
(function (Manga) {
    Manga["Beastars"] = "20523";
    Manga["BeastComplex"] = "22194";
    Manga["ParusGraffiti"] = "42209";
})(Manga = exports.Manga || (exports.Manga = {}));
class CommandError {
    constructor(message) {
        this.message = message;
    }
}
exports.CommandError = CommandError;
//# sourceMappingURL=types.js.map