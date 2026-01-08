"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
// define los roles que pueden tener los usuarios y que se usan para aplicar guardas
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["CLIENT"] = "client";
    Role["CHOFER"] = "chofer";
})(Role || (exports.Role = Role = {}));
