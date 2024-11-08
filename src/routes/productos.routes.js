import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      include: {
        categoria: true,
      },
    });
    res.json(productos); // Devuelve los productos como respuesta en formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

//ruta para consultar un solo producto
router.get("/ConsultarProducto/:id", async (req, res) => {
  const consultProduct = await prisma.productos.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      categoria: true,
    },
  });
  res.json(consultProduct);
});

//Ruta para registrar los productos
router.post("/RegistroProducts", async (req, res) => {
    try {
        const { nombre, precio, stock, categoriaId } = req.body; 
    
        // Verificar si el nombre ya existe en la base de datos
        const productoExistente = await prisma.productos.findUnique({
          where: {
            nombre: nombre,
          },
        });
    
        if (productoExistente) {
          return res.status(400).json({ error: "Ya existe un producto con ese nombre" });
        }
    
        // Si no existe, crear el nuevo producto
        const newProducto = await prisma.productos.create({
          data: {
            nombre,
            precio,
            stock,
            categoriaId, // Asumimos que estás pasando un id de categoría
          },
        });
    
        res.status(201).json(newProducto); // Código 201 para indicar que el producto fue creado
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el producto" });
      }
    });

// Ruta para actualizar un producto
router.put("/ActualizarProducto/:id", async (req, res) => {
    const { nombre, precio, stock, categoriaId } = req.body;
  
    // Validación de campos requeridos
    if (!nombre || !precio || !stock || !categoriaId) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
  
    try {
      // Intentamos actualizar el producto
      const productoActualizado = await prisma.productos.update({
        where: {
          id: parseInt(req.params.id), // Aseguramos que el ID sea un número
        },
        data: {
          nombre,
          precio,
          stock,
          categoriaId,
        },
      });
  
      // Si el producto no se encuentra, devolver error 404
      if (!productoActualizado) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
  
      // Si todo sale bien, devolver el producto actualizado
      res.status(200).json(productoActualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  });
  

//ruta para eliminar un producto
router.delete("/EliminarProducto/:id", async (req, res) => {
  const DeleteProduct = await prisma.productos.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(DeleteProduct);
});
export default router;
