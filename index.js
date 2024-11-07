import express from "express";
import bodyParser from 'body-parser';
import productosController from './controllers/ProductsController.js';
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establecer EJS como motor de plantillas (si usas EJS)
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// Usar el controlador de productos con el prefijo /api
app.use("/api", productosController);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
