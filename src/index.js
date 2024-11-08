import express from "express";
import bodyParser from "body-parser";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura la carpeta de archivos estáticos
app.use(express.static('public'));

// Establecer EJS como motor de plantillas 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// Usar lsd rutas de productos y categorias de los productos con el prefijo /api
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);

//iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
