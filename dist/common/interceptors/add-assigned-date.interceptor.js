"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAssignedDateInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let AddAssignedDateInterceptor = class AddAssignedDateInterceptor {
    intercept(_, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (!Array.isArray(data)) {
                return data;
            }
            const today = new Date();
            return data.map((item, index) => {
                if (typeof item !== 'object' || item === null) {
                    return item;
                }
                const assignedDate = new Date(today);
                assignedDate.setDate(today.getDate() + index);
                return {
                    ...item,
                    assignedDate: assignedDate.toISOString().split('T')[0],
                };
            });
        }));
    }
};
exports.AddAssignedDateInterceptor = AddAssignedDateInterceptor;
exports.AddAssignedDateInterceptor = AddAssignedDateInterceptor = __decorate([
    (0, common_1.Injectable)()
], AddAssignedDateInterceptor);
//# sourceMappingURL=add-assigned-date.interceptor.js.map