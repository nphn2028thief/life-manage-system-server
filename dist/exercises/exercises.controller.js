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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const exercise_dto_1 = require("./dto/exercise.dto");
const exercises_service_1 = require("./exercises.service");
let ExercisesController = class ExercisesController {
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    getExercises() {
        return this.exerciseService.getExercisesAsync();
    }
    getExerciseById(id) {
        return this.exerciseService.getExerciseByIdAsync(id);
    }
    createExerciseBySystem(req, createExerciseDto) {
        return this.exerciseService.createExerciseAsync(req, createExerciseDto);
    }
    createExerciseByUser(req, createExerciseDto) {
        return this.exerciseService.createExerciseAsync(req, createExerciseDto);
    }
    updateExerciseById(req, updateExerciseDto) {
        return this.exerciseService.updateExerciseByIdAsync(req, updateExerciseDto);
    }
    deleteExerciseById(req) {
        return this.exerciseService.deleteExerciseByIdAsync(req);
    }
};
exports.ExercisesController = ExercisesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getExercises", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getExerciseById", null);
__decorate([
    (0, common_1.Post)('/system'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exercise_dto_1.CreateExerciseDto]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "createExerciseBySystem", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exercise_dto_1.CreateExerciseDto]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "createExerciseByUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exercise_dto_1.UpdateExerciseDto]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "updateExerciseById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "deleteExerciseById", null);
exports.ExercisesController = ExercisesController = __decorate([
    (0, common_1.Controller)('exercises'),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], ExercisesController);
//# sourceMappingURL=exercises.controller.js.map