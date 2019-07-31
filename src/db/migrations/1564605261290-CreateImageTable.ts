import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateImageTable1564605261290 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, CONSTRAINT "UQ_e4dfc6a6f95452c9c931f5df487" UNIQUE ("name"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_f7d0274c3b515f1d6a205909c7d" FOREIGN KEY ("addedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_f7d0274c3b515f1d6a205909c7d"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
