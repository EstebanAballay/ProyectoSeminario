import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordHashToUser1680000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            ADD COLUMN password_hash text NOT NULL DEFAULT '';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            DROP COLUMN password_hash;
        `);
    }
}
