"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserLastNickname1562046320857 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastNickname" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastNickname"`);
    }
}
exports.UserLastNickname1562046320857 = UserLastNickname1562046320857;
//# sourceMappingURL=1562046320857-UserLastNickname.js.map