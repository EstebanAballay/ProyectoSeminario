import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateUserTable1680000000001Migration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear schema si no existe
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS microservice_usuarios;`);

        // Borrar la tabla user si existe
        await queryRunner.query(`DROP TABLE IF EXISTS microservice_usuarios."user" CASCADE;`);

        // Crear tabla roles si no existe
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS microservice_usuarios.roles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(50) UNIQUE NOT NULL
            );
        `);

        // Crear tabla user según la entidad
        await queryRunner.query(`
            CREATE TABLE microservice_usuarios."user" (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                apellido VARCHAR(255) NOT NULL,
                dni BIGINT NOT NULL,
                email VARCHAR(255) NOT NULL,
                celular BIGINT NOT NULL,
                "CUIT" VARCHAR(20) NOT NULL,
                direccion VARCHAR(255) NOT NULL,
                password_hash text NOT NULL DEFAULT '',  -- ✅ CORREGIDO
                rol_id INT NOT NULL,
                CONSTRAINT fk_user_rol FOREIGN KEY (rol_id)
                    REFERENCES microservice_usuarios.roles(id) ON DELETE RESTRICT
            );
        `);

        // Hacer NOT NULL (aunque ya está definido)
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            ALTER COLUMN rol_id SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir: borrar tabla user
        await queryRunner.query(`DROP TABLE IF EXISTS microservice_usuarios."user" CASCADE;`);
    }
}
