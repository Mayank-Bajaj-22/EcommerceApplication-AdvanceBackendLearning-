import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

export const registerUserController = CatchAsync(
    async (req: Request, res: Response) => {
        const result = await authService.registerUserService(req.body);

        setCookies(res, result.accessToken, result.refreshToken);
        
        sendResponse(res, 201, {
            success: true,
            message: "Account created successfully.",
            data: result,
        });
    }
)

export const loginUserController = CatchAsync(
    async (req: Request, res: Response) => {
        const result = await authService.loginUserService(req.body);

        setCookies(res, result.accessToken, result.refreshToken);

        sendResponse(res, 200, {
            success: true,
            message: "User logged in successfully.",
            data: result,
        });
    }
)

export const getCurrentUserController = CatchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;

        const result = await authService.getCurrentUserService(user.id);

        sendResponse(res, 200, {
            success: true,
            message: "User details fetched successfully",
            data: result,
        });
    }
)

export const logoutController = CatchAsync(
    async (req: Request, res: Response) => {
        const isLoggedOut = await authService.logoutUserService(req.body);

        if (isLoggedOut) {
            destroyCookies(res);
        }

        sendResponse(res, 200, {
            success: true,
            message: "User logged out successfully",
        });
    }
)

export const logoutAllDevicesController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;

        const isLoggedOutOfAllDevices = await authService.logoutAllDevicesService(userId);

        if (isLoggedOutOfAllDevices) {
            destroyCookies(res);
        }

        sendResponse(res, 200, {
            success: true,
            message: "User logged out of all devices",
        });
    }
)

export const refreshTokenController = CatchAsync(
    async (req: Request, res: Response) => {
        const result = await authService.refreshTokenService(req.body);

        setCookies(res, result.accessToken, result.refreshToken);

        sendResponse(res, 200, {
            success: true,
            message: "Token refreshed",
            data: result,
        });
    }
)