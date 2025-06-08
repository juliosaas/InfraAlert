import PinoHttp from "pino-http";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import pino from "pino";
import { PrismaClient } from "@prisma/client";

const HOST = process.env.HOST ?? "localhost";
const PORT = (process.env.PORT as unknown as number) ?? 3000;

const prisma = new PrismaClient();

export const logger = PinoHttp({
  transport: {
    level: "debug",
    target: "pino-pretty",
    options: {
      destination: 2,
      all: true,
      translateTime: true,
    }
  },
});

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(logger);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, async () => {
  console.clear()
  console.log("Servidor da API está rondando na porta http://localhost:3000\n")

  try {

    if( !process.env.SUPERADMIN_EMAIL ) {
      console.error("Variável de ambiente SUPERADMIN_EMAIL não está definida.");
      process.exit(1);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: process.env.SUPERADMIN_EMAIL
      }
    });

    if (!user) {

      if (!process.env.SUPERADMIN_PASSWORD) {
        console.error("Variáveis de ambiente SUPERADMIN_PASSWORD não estão definidas.");
        process.exit(1);
      }

      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: process.env.SUPERADMIN_EMAIL,
          password: process.env.SUPERADMIN_PASSWORD,
          role: "ADMIN",
        }
      });

      console.log("Usuário Super Admin criado com sucesso!");
    }

    console.log(`Verificação de usuário Super Admin concluída com sucesso!\n\nEMAIL: ${process.env.SUPERADMIN_EMAIL}\nSENHA: ${process.env.SUPERADMIN_PASSWORD}\n\n`);

  } catch (error) {
    console.error("Erro ao verificar ou criar o usuário Super Admin:", error);
    process.exit(1);
  }

})


app.get("/", ((req, res) => { return res.json({ message: "Seja bem vindo ao INFRAALERT" }) }))

server.listen(PORT, () => {
  logger.logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.logger.info(`Swagger running at http://${HOST}:${PORT}/docs`);
});

server.on("error", (err) => {
  logger.logger.error("Erro no servidor:", err);
});

export default app;