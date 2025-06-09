-- CreateTable
CREATE TABLE "RotaSegura" (
    "id" SERIAL NOT NULL,
    "nomeRua" TEXT NOT NULL,
    "horarioInicio" TEXT NOT NULL,
    "horarioFim" TEXT NOT NULL,
    "indicePericulosidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RotaSegura_pkey" PRIMARY KEY ("id")
);
