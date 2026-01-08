"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    constructor(http, jwtService) {
        this.http = http;
        this.jwtService = jwtService;
        this.usersUrl = "http://users:3001/users";
    }
    // ---------------------------
    //  Métodos auxiliares HTTP
    // ---------------------------
    async findOneByEmail(email) {
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.http.get(`${this.usersUrl}/by-email/${email}`));
            return res.data;
        }
        catch {
            return null;
        }
    }
    async findOneByEmailWithPassword(email) {
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.http.get(`${this.usersUrl}/by-email-password/${email}`));
            return res.data;
        }
        catch {
            return null;
        }
    }
    async crearUsuario(data) {
        await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.usersUrl}`, data));
    }
    // ---------------------------
    //        REGISTER
    // ---------------------------
    async register(registerDto) {
        const { nombre, apellido, dni, email, celular, CUIT, direccion, password, } = registerDto;
        const existingUser = await this.findOneByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException("Email already exists");
        }
        await this.crearUsuario({
            nombre,
            apellido,
            dni,
            email,
            celular,
            CUIT,
            direccion,
            password,
        });
        return { message: "User created successfully" };
    }
    // ---------------------------
    //          LOGIN
    // ---------------------------
    async login({ email, password }) {
        console.log("🟢 SERVICE LOGIN START");
        const user = await this.findOneByEmailWithPassword(email);
        if (!user) {
            console.log("🟡 USER NOT FOUND");
            throw new common_1.UnauthorizedException("Invalid email");
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log("🔴 PASSWORD INVALID");
            throw new common_1.UnauthorizedException("Invalid password");
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        console.log("✅ LOGIN OK, TOKEN GENERATED");
        return {
            token,
            email: user.email,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, jwt_1.JwtService])
], AuthService);
