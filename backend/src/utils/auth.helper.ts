import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const hashRefreshToken = (refreshToken: string) => {
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
}