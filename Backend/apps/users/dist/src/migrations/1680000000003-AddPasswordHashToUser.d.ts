import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddPasswordHashToUser1680000000002 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
