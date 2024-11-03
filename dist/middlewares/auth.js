var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "../config/passport.config.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
export const login = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: (info === null || info === void 0 ? void 0 : info.message) || "Login failed", // More descriptive error message if available
                user: req.body,
            });
        }
        // Generate JWT if user is authenticated
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET_KEY || "jwt_secret", { expiresIn: "2h" });
        return res.status(200).json({ userId: user.id, username: user.username, token });
    })(req, res, next);
}));
//# sourceMappingURL=auth.js.map