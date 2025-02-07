import { Response } from "express";

const messages = {
  internalError: { status: 500, message: "Internal server error" },
  badRequest: { status: 400, message: "Bad request" },
  invalidId: { status: 400, message: "Invalid id param" },
  invalidSerial: { status: 400, message: "Invalid serialNumber param" },
} as const;

export const sendMessage = (res: Response, key: keyof typeof messages) => {
  const { status, message } = messages[key] as {
    status: number;
    message: string;
  };

  res.status(status).json(message);
};
