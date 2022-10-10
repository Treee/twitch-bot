"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRETS = void 0;
// local dev loading. AWS fills in environment variables during build time
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
    dotenv_1.default.config({ path: "./local.env" });
}
exports.SECRETS = {
    botClientId: process.env.BOT_CLIENT_ID || "",
    botClientSecret: process.env.BOT_CLIENT_SECRET || "",
    botPublisherSecret: process.env.BOT_PUBLISHER_SECRET || "",
    serverPort: process.env.SERVER_PORT,
    steam: {
        apiKey: process.env.STEAM_API_KEY || "",
        userId: process.env.STEAM_USER_ID || "",
    },
    irc: {
        user: process.env.IRC_USER || "",
        userOAuthPassword: process.env.IRC_USER_OAUTH_PASSWORD || "",
        channelsToListenTo: [process.env.IRC_CHANNELS_TO_MONITOR || ""],
    },
};
