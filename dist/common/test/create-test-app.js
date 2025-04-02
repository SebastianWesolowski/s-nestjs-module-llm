"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = createTestApp;
const testing_1 = require("@nestjs/testing");
async function createTestApp(module) {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [module],
    }).compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
}
//# sourceMappingURL=create-test-app.js.map