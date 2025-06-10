
// Importa el framework Express para crear el servidor web
const express = require('express');
// Importa Mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Importa bcrypt para encriptar contraseñas
const bcrypt = require('bcrypt');
// Importa cors para permitir solicitudes de diferentes dominios
const cors = require('cors');
// Importa body-parser para procesar datos JSON en las solicitudes
const bodyParser = require('body-parser');

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto donde se ejecutará el servidor
const PORT = 3000;

// Middleware

// Habilita CORS para permitir peticiones desde otros orígenes
app.use(cors());
// Permite que Express entienda datos en formato JSON en las solicitudes
app.use(bodyParser.json());
// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Conexión a MongoDB

// Conecta a la base de datos MongoDB llamada 'pasteleria'
mongoose.connect('mongodb://localhost:27017/pasteleria', {
    useNewUrlParser: true,      // Usa el nuevo parser de URL
    useUnifiedTopology: true    // Usa el nuevo motor de monitoreo de servidores
})
// Si la conexión es exitosa, muestra un mensaje en consola
.then(() => console.log('Conectado a MongoDB'))
// Si hay un error en la conexión, lo muestra en consola
.catch(err => console.error(err));

// Esquemas y Modelos

// Define el esquema para los usuarios
const UsuarioSchema = new mongoose.Schema({
    nombre: String,     // Nombre del usuario
    email: String,      // Correo electrónico del usuario
    password: String    // Contraseña encriptada del usuario
});

// Crea el modelo Usuario basado en el esquema anterior
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Define el esquema para los pasteles
const PastelSchema = new mongoose.Schema({
    nombre: String,     // Nombre del pastel
    precio: Number      // Precio del pastel
});
// Crea el modelo Pastel basado en el esquema anterior
const Pastel = mongoose.model('Pastel', PastelSchema);

// Define el esquema para los empleados
const EmpleadoSchema = new mongoose.Schema({
    nombre: String,     // Nombre del empleado
    rol: String         // Rol del empleado (ejemplo: repostero, vendedor)
});
// Crea el modelo Empleado basado en el esquema anterior
const Empleado = mongoose.model('Empleado', EmpleadoSchema);

// Define el esquema para los pedidos
const PedidoSchema = new mongoose.Schema({
    cliente: String,    // Nombre del cliente que hace el pedido
    producto: String    // Producto solicitado en el pedido
});
// Crea el modelo Pedido basado en el esquema anterior
const Pedido = mongoose.model('Pedido', PedidoSchema);

// Rutas de autenticación

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    // Extrae nombre, email y password del cuerpo de la solicitud
    const { nombre, email, password } = req.body;
    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea un nuevo usuario con los datos recibidos y la contraseña encriptada
    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
    // Guarda el usuario en la base de datos
    await nuevoUsuario.save();
    // Responde con un mensaje de éxito y código 201 (creado)
    res.status(201).send('Usuario registrado');
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    // Extrae email y password del cuerpo de la solicitud
    const { email, password } = req.body;
    // Busca un usuario con el email proporcionado
    const usuario = await Usuario.findOne({ email });
    // Si no existe el usuario, responde con error 401 (no autorizado)
    if (!usuario) return res.status(401).send('Usuario no encontrado');
    // Compara la contraseña proporcionada con la almacenada (encriptada)
    const valid = await bcrypt.compare(password, usuario.password);
    // Si la contraseña no es válida, responde con error 401
    if (!valid) return res.status(401).send('Contraseña incorrecta');
    // Si todo es correcto, responde con mensaje de éxito
    res.send('Inicio de sesión exitoso');
});

// CRUD Pasteles

// Ruta para obtener todos los pasteles
app.get('/api/pasteles', async (req, res) => {
    // Busca todos los pasteles en la base de datos
    const pasteles = await Pastel.find();
    // Devuelve la lista de pasteles en formato JSON
    res.json(pasteles);
});

// Ruta para crear un nuevo pastel
app.post('/api/pasteles', async (req, res) => {
    // Crea un nuevo pastel con los datos recibidos en la solicitud
    const nuevo = new Pastel(req.body);
    // Guarda el pastel en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Pastel creado');
});

// Ruta para eliminar un pastel por su ID
app.delete('/api/pasteles/:id', async (req, res) => {
    // Elimina el pastel cuyo ID se recibe en la URL
    await Pastel.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Pastel eliminado');
});

// CRUD Empleados

// Ruta para obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
    // Busca todos los empleados en la base de datos
    const empleados = await Empleado.find();
    // Devuelve la lista de empleados en formato JSON
    res.json(empleados);
});

// Ruta para crear un nuevo empleado
app.post('/api/empleados', async (req, res) => {
    // Crea un nuevo empleado con los datos recibidos en la solicitud
    const nuevo = new Empleado(req.body);
    // Guarda el empleado en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Empleado agregado');
});

// Ruta para eliminar un empleado por su ID
app.delete('/api/empleados/:id', async (req, res) => {
    // Elimina el empleado cuyo ID se recibe en la URL
    await Empleado.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Empleado eliminado');
});

// CRUD Pedidos

// Ruta para obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const pedidos = await Pedido.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(pedidos);
});

// Ruta para crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
    // Crea un nuevo pedido con los datos recibidos en la solicitud
    const nuevo = new Pedido(req.body);
    // Guarda el pedido en la base de datos
    await nuevo.save();
    // Responde con mensaje de éxito y código 201 (creado)
    res.status(201).send('Pedido registrado');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/pedidos/:id', async (req, res) => {
    // Elimina el pedido cuyo ID se recibe en la URL
    await Pedido.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Pedido eliminado');
});

// Iniciar servidor

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    // Muestra en consola la URL donde está corriendo el servidor
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});