"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveUser = void 0;
const common_1 = require("@nestjs/common");
exports.ActiveUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
//# sourceMappingURL=active-user.decorator.js.map