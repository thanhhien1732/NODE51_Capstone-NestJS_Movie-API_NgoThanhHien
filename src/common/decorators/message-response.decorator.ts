import { SetMetadata } from "@nestjs/common"

export const MESSAGE_RESPONSE = "MESSAGE_RESPONSE"

export const MessageResponse = (message: string) => {
    return SetMetadata(MESSAGE_RESPONSE, message);
}