"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecreateUserTable1680000000001Migration = void 0;
class RecreateUserTable1680000000001Migration {
    async up(queryRunner) {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS microservice_usuarios;`);
        await queryRunner.query(`DROP TABLE IF EXISTS microservice_usuarios."user" CASCADE;`);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS microservice_usuarios.roles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(50) UNIQUE NOT NULL
            );
        `);
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
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            ALTER COLUMN rol_id SET NOT NULL;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS microservice_usuarios."user" CASCADE;`);
    }
}
exports.RecreateUserTable1680000000001Migration = RecreateUserTable1680000000001Migration;
//# sourceMappingURL=1759349002826-CreateRoles.js.map