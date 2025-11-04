import { MigrationInterface, QueryRunner } from "typeorm";
export declare class RecreateUserTable1680000000001Migration implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
