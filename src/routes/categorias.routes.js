import { Router } from "express";
import { prisma } from "../db.js";
const router = Router();

router.get("/", async (req, res) => {
  const categorias = await prisma.Categoria.findMany();
  res.json(categorias);
});

export default router;
