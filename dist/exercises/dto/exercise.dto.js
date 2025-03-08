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
exports.UpdateExerciseDto = exports.CreateExerciseDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateExerciseDto {
}
exports.CreateExerciseDto = CreateExerciseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Exercise name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Exercise name cannot be empty' }),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description name cannot be empty' }),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExcercisesCategory, {
        message: 'Exercise category must be GYM or CARDIO',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Exercise category cannot be empty' }),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Calories burned per rep must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Calories burned per rep cannot be empty' }),
    __metadata("design:type", Number)
], CreateExerciseDto.prototype, "caloriesBurnedPerRep", void 0);
class UpdateExerciseDto {
}
exports.UpdateExerciseDto = UpdateExerciseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Exercise name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExerciseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExerciseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExcercisesCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExerciseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Calories burned per rep must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExerciseDto.prototype, "caloriesBurnedPerRep", void 0);
//# sourceMappingURL=exercise.dto.js.map