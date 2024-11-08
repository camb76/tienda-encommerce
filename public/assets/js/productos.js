let dataTable; // Variable global para almacenar la instancia de DataTables

// Función para inicializar DataTables (solo se llama una vez)
function inicializarDataTable() {
  dataTable = $("#productosTable").DataTable({
    responsive: true,
    searching: true,
    paging: true,
    info: true,
    ordering: false,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json", // Español
    },
  });
}

// Función para cargar productos en la tabla
async function cargarProductos() {
  try {
    const response = await axios.get("/api/productos");
    const productos = response.data;
    const tabla = document
      .getElementById("productosTable")
      .getElementsByTagName("tbody")[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos productos

    productos.forEach((producto) => {
      const fila = tabla.insertRow();
      fila.innerHTML = `
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${formatearPrecio(producto.precio)}$</td>
          <td>${producto.stock}</td>
          <td>${
            producto.fecha_registro
              ? formatearFecha(producto.fecha_registro)
              : "Sin fecha"
          }</td>
          <td>${
            producto.categoria ? producto.categoria.nombre : "Sin categoría"
          }</td>
           <td>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#actualizarModal" onclick="mostrarFormularioActualizar(${
      producto.id
    })">Actualizar</button>
    <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
  </td>
        `;
    });

    // Refrescar los datos de DataTables sin destruir la tabla
    dataTable.clear(); // Limpiar los datos previos en DataTables
    dataTable.rows.add($(tabla).find('tr')); // Agregar las nuevas filas
    dataTable.draw(); // Dibujar la tabla actualizada

  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Inicializar DataTables cuando el DOM esté listo
$(document).ready(function () {
  inicializarDataTable(); // Inicializar DataTables una vez
  cargarProductos();      // Cargar los datos en la tabla
});




// Función para ordenar la tabla de precios
function cambiarOrdenPrecios(direccion) {
  const tabla = document.getElementById("productosTable");
  const rows = Array.from(tabla.rows).slice(1); // Obtenemos todas las filas, exceptuando la de encabezados

  // Ordenar las filas según la columna de precio (índice 2)
  rows.sort((a, b) => {
    const precioA = parseFloat(a.cells[2].innerText.replace("$", ""));
    const precioB = parseFloat(b.cells[2].innerText.replace("$", ""));

    if (direccion === "asc") {
      return precioA - precioB;
    } else {
      return precioB - precioA;
    }
  });

  // Limpiar el cuerpo de la tabla y agregar las filas ordenadas
  const tbody = tabla.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));
}



// Asegurarse de que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
  // Llamar a la función de carga de productos al inicio
  cargarProductos();

  // Enviar datos usando Axios cuando el formulario se envíe
  document
    .getElementById("productoForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevenir el envío normal del formulario

      // Obtener los valores del formulario
      const nombre = document.getElementById("nombre").value;
      const precioRaw = document.getElementById("precio").value;
      const precio = parseFloat(precioRaw.replace(/,/g, ''));
      const stock = parseInt(document.getElementById("stock").value, 10);
      const categoriaId = parseInt(
        document.getElementById("categoriaId").value,
        10
      );

      // Obtener el div para mostrar el mensaje
      const mensajeDiv = document.getElementById("mensaje");

      try {
        // Enviar datos con Axios
        const response = await axios.post("/api/productos/RegistroProducts", {
          nombre,
          precio,
          stock,
          categoriaId,
        });

        // Verificar la respuesta
        if (response.status === 201) {
          mensajeDiv.innerText = "Producto registrado con éxito.";
          mensajeDiv.style.color = "green"; // Mensaje de éxito
          // Actualizar la lista de productos sin recargar la página
          cargarProductos();
        }
      } catch (error) {
        // Manejar errores
        if (error.response && error.response.data) {
          mensajeDiv.innerText = `Error: ${error.response.data.error}`;
          mensajeDiv.style.color = "red"; // Mensaje de error
        } else {
          mensajeDiv.innerText = "Error al registrar el producto.";
          mensajeDiv.style.color = "red"; // Mensaje de error
        }
        console.error("Error:", error);
      }
    });
});

async function actualizarProducto(id) {
  const nombre = document.getElementById("nombre_act").value;
  const precio = parseFloat(document.getElementById("precio_act").value);
  const stock = parseInt(document.getElementById("stock_act").value, 10);
  const categoriaId = parseInt(
    document.getElementById("categoriaId_act").value,
    10
  );

  try {
    const response = await axios.put(
      `/api/productos/ActualizarProducto/${id}`,
      {
        nombre,
        precio,
        stock,
        categoriaId,
      }
    );

    if (response.status === 200) {
      alert("Producto actualizado con éxito");
      cargarProductos(); // Recargar la tabla de productos
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    alert("Error al actualizar el producto");
  }
}


function mostrarFormularioActualizar(id) {
  // Aquí puedes cargar los datos del producto que se quiere actualizar en el formulario.
  // Por ejemplo, realiza una petición a la API para obtener los detalles del producto:
  axios
    .get(`/api/productos/ConsultarProducto/${id}`)
    .then((response) => {
      const producto = response.data;

      // Rellenar el formulario con los datos del producto
      document.getElementById("nombre_act").value = producto.nombre;
      document.getElementById("precio_act").value = producto.precio;
      document.getElementById("stock_act").value = producto.stock;
      document.getElementById("categoriaId_act").value = producto.categoriaId;

      // Cambiar la acción del formulario para actualizar el producto
      document.getElementById("actualizarForm").onsubmit = function (e) {
        e.preventDefault();
        actualizarProducto(id);
      };
    })
    .catch((error) => {
      console.error("Error al cargar los datos del producto:", error);
    });
}




async function eliminarProducto(id) {
  try {
    const response = await axios.delete(
      `/api/productos/EliminarProducto/${id}`
    );

    if (response.status === 200) {
      alert("Producto eliminado con éxito");
      cargarProductos(); // Recargar la tabla de productos
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert("Error al eliminar el producto");
  }
}


function formatearPrecio(precio) {
  return precio.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"); // Ejemplo: 1000.00 -> 1,000.00
}



// Función para formatear la fecha de registro si es necesario
function formatearFecha(fecha) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(fecha).toLocaleDateString("es-ES", options);
}
