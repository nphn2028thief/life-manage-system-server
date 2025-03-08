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
exports.CreateWorkoutDto = exports.ExcerciseDto = exports.WorkoutDto = void 0;
const class_validator_1 = require("class-validator");
class WorkoutDto {
}
exports.WorkoutDto = WorkoutDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Workout name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Workout name cannot be empty' }),
    __metadata("design:type", String)
], WorkoutDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], WorkoutDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Start time cannot be empty' }),
    __metadata("design:type", Date)
], WorkoutDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'End time cannot be empty' }),
    __metadata("design:type", Date)
], WorkoutDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Burned calories cannot be empty' }),
    __metadata("design:type", Number)
], WorkoutDto.prototype, "caloriesBurned", void 0);
class ExcerciseDto {
}
exports.ExcerciseDto = ExcerciseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Excercise id must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Exercise id cannot be empty' }),
    __metadata("design:type", String)
], ExcerciseDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sets cannot be empty' }),
    __metadata("design:type", Number)
], ExcerciseDto.prototype, "sets", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Reps cannot be empty' }),
    __metadata("design:type", Number)
], ExcerciseDto.prototype, "reps", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Weight cannot be empty' }),
    __metadata("design:type", Number)
], ExcerciseDto.prototype, "weight", void 0);
class CreateWorkoutDto {
}
exports.CreateWorkoutDto = CreateWorkoutDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Workout cannot be empty' }),
    __metadata("design:type", WorkoutDto)
], CreateWorkoutDto.prototype, "workout", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Excercise must be at least 1' }),
    __metadata("design:type", Array)
], CreateWorkoutDto.prototype, "excercises", void 0);
//# sourceMappingURL=workout.dto.js.map