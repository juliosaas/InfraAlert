import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const alertController = {
  listAll: async (req: Request, res: Response) => {
    const alerts = await prisma.alert.findMany();
    return res.json({ alerts: alerts });
  },
};

export default alertController;
