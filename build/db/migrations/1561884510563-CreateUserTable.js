"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUserTable1561884510563 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "discordId" character varying NOT NULL, "legs" integer NOT NULL DEFAULT 2, "legsOffered" integer NOT NULL DEFAULT 0, CONSTRAINT "UQ_13af5754f14d8d255fd9b3ee5c7" UNIQUE ("discordId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_legs" ("from" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_89b066e1c06db34f38a7135c495" PRIMARY KEY ("from", "to"))`);
        await queryRunner.query(`CREATE INDEX "IDX_672807f48c230b604482547695" ON "users_legs" ("from") `);
        await queryRunner.query(`CREATE INDEX "IDX_0812cf34a03ebe43569f5f0b56" ON "users_legs" ("to") `);
        await queryRunner.query(`ALTER TABLE "users_legs" ADD CONSTRAINT "FK_672807f48c230b6044825476959" FOREIGN KEY ("from") REFERENCES "user"("discordId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_legs" ADD CONSTRAINT "FK_0812cf34a03ebe43569f5f0b56d" FOREIGN KEY ("to") REFERENCES "user"("discordId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users_legs" DROP CONSTRAINT "FK_0812cf34a03ebe43569f5f0b56d"`);
        await queryRunner.query(`ALTER TABLE "users_legs" DROP CONSTRAINT "FK_672807f48c230b6044825476959"`);
        await queryRunner.query(`DROP INDEX "IDX_0812cf34a03ebe43569f5f0b56"`);
        await queryRunner.query(`DROP INDEX "IDX_672807f48c230b604482547695"`);
        await queryRunner.query(`DROP TABLE "users_legs"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateUserTable1561884510563 = CreateUserTable1561884510563;
//# sourceMappingURL=1561884510563-CreateUserTable.js.map