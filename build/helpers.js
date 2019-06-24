"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=helpers.js.map