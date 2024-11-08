import express from "express";
import bodyParser from "body-parser";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // Procesa JSON
app.use(express.urlencoded({ extended: true })); // Procesa datos URL encoded

// Configura la carpeta de archivos estáticos
app.use(express.static("public"));

// Establecer EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ruta principal
app.get("/", (req, res) => {
  res.render("index");
});

// Usar las rutas de productos y categorías con el prefijo /api
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
