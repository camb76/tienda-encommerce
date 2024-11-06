import express, { json } from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("hola mundo");
});

app.get("/productos", (req, res) => {
  const data = readData();
  res.json(data.productos);
});

app.get("/productos/:id", (req, res) => {
  try {
    const data = readData();
    const id = parseInt(req.params.id);
    const producto = data.productos.find((producto) => producto.id === id);
    if (!producto) {
      console.log("no existe");
    }
    res.json(producto);
  } catch (error) {
    console.log(error);
  }
});

app.post("/productos", (req, res) => {
  const data = readData();
  const body = req.body;
  const newProduct = {
    id: data.productos.length + 1,
    ...body,
  };
  data.productos.push(newProduct);
  writeData(data);
  res.json(newProduct);
});

app.put("/productos/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const productIndex = data.productos.findIndex(
    (producto) => producto.id === id
  );
  data.productos[productIndex] = {
    ...data.productos[productIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "datos actualizados correctamente" });
});

app.delete("/productos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const productIndex = data.productos.findIndex(
    (producto) => producto.id === id
  );
  data.productos.splice(productIndex, 1)
  writeData(data)
  res.json({message: "datos borrados correctamente"})
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
