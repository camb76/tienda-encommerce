// controllers/productosController.js
import express from "express";
import fs from "fs";

const router = express.Router();

// Lee los datos del archivo db.json
const readData = () => {
  try {
    const data = fs.readFileSync("./database/db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { productos: [] };
  }
};

// Escribe los datos en el archivo db.json
const writeData = (data) => {
  try {
    fs.writeFileSync("./database/db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

// Definición de los endpoints

router.get("/productos", (req, res) => {
  const data = readData();
  res.json(data.productos);
});

router.get("/productos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const producto = data.productos.find((producto) => producto.id === id);
  if (!producto) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json(producto);
});

router.post("/productos", (req, res) => {
  const data = readData();
  const newProduct = {
    id: data.productos.length + 1,
    ...req.body,
  };
  data.productos.push(newProduct);
  writeData(data);
  res.status(201).json(newProduct);
});

router.put("/productos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const productIndex = data.productos.findIndex(
    (producto) => producto.id === id
  );
  if (productIndex === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  data.productos[productIndex] = {
    ...data.productos[productIndex],
    ...req.body,
  };
  writeData(data);
  res.json({ message: "Producto actualizado correctamente" });
});

router.delete("/productos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const productIndex = data.productos.findIndex(
    (producto) => producto.id === id
  );
  if (productIndex === -1) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  data.productos.splice(productIndex, 1);
  writeData(data);
  res.json({ message: "Producto eliminado correctamente" });
});

export default router;
