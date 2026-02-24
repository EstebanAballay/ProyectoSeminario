"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPasswordHashToUser1680000000002 = void 0;
class AddPasswordHashToUser1680000000002 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            ADD COLUMN password_hash text NOT NULL DEFAULT '';
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE microservice_usuarios."user"
            DROP COLUMN password_hash;
        `);
    }
}
exports.AddPasswordHashToUser1680000000002 = AddPasswordHashToUser1680000000002;
//# sourceMappingURL=1680000000003-AddPasswordHashToUser.js.map