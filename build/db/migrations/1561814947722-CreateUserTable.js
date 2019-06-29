"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUserTable1561814947722 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "discordId" character varying NOT NULL, "legs" integer NOT NULL DEFAULT 2, "legsEaten" integer NOT NULL DEFAULT 0, CONSTRAINT "UQ_13af5754f14d8d255fd9b3ee5c7" UNIQUE ("discordId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateUserTable1561814947722 = CreateUserTable1561814947722;
//# sourceMappingURL=1561814947722-CreateUserTable.js.map