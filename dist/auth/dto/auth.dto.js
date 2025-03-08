"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInDto = exports.SignUpDto = void 0;
const class_validator_1 = require("class-validator");
class SignUpDto {
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username cannot be empty.' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Email must be a string.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email is invalid.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email cannot be empty.' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty.' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'First name must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name cannot be empty.' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Last name must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name cannot be empty.' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Date of birth must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth cannot be empty.' }),
    __metadata("design:type", Date)
], SignUpDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Weight cannot be empty.' }),
    __metadata("design:type", Number)
], SignUpDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Height cannot be empty.' }),
    __metadata("design:type", Number)
], SignUpDto.prototype, "height", void 0);
class SignInDto {
}
exports.SignInDto = SignInDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username cannot be empty.' }),
    __metadata("design:type", String)
], SignInDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password must be a string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty.' }),
    __metadata("design:type", String)
], SignInDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map