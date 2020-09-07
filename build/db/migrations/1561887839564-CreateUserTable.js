"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1561887839564 = void 0;
class CreateUserTable1561887839564 {
    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE \"user\" (\"id\" SERIAL NOT NULL, \"discordId\" character varying NOT NULL, CONSTRAINT \"UQ_13af5754f14d8d255fd9b3ee5c7\" UNIQUE (\"discordId\"), CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"users_legs\" (\"from\" integer NOT NULL, \"to\" integer NOT NULL, CONSTRAINT \"PK_89b066e1c06db34f38a7135c495\" PRIMARY KEY (\"from\", \"to\"))");
        await queryRunner.query("CREATE INDEX \"IDX_672807f48c230b604482547695\" ON \"users_legs\" (\"from\") ");
        await queryRunner.query("CREATE INDEX \"IDX_0812cf34a03ebe43569f5f0b56\" ON \"users_legs\" (\"to\") ");
        await queryRunner.query("ALTER TABLE \"users_legs\" ADD CONSTRAINT \"FK_672807f48c230b6044825476959\" FOREIGN KEY (\"from\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"users_legs\" ADD CONSTRAINT \"FK_0812cf34a03ebe43569f5f0b56d\" FOREIGN KEY (\"to\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION");
    }
    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE \"users_legs\" DROP CONSTRAINT \"FK_0812cf34a03ebe43569f5f0b56d\"");
        await queryRunner.query("ALTER TABLE \"users_legs\" DROP CONSTRAINT \"FK_672807f48c230b6044825476959\"");
        await queryRunner.query("DROP INDEX \"IDX_0812cf34a03ebe43569f5f0b56\"");
        await queryRunner.query("DROP INDEX \"IDX_672807f48c230b604482547695\"");
        await queryRunner.query("DROP TABLE \"users_legs\"");
        await queryRunner.query("DROP TABLE \"user\"");
    }
}
exports.CreateUserTable1561887839564 = CreateUserTable1561887839564;
//# sourceMappingURL=1561887839564-CreateUserTable.js.map