const express = require('express');
const cors = require('cors');
const{ PORT } = require('./config/env');

const app = express();

//Middlewares globales
app.use(cors());
app.use(express.json());

//Middleware de auditoria - registra cada petición en la consola
app.use((req, res, next)=> {
    const inicio = Date.now();

    res.on('finish',()=>{
        const duracion = Date.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion}ms)`);
    });
    next();
});

//Ruta de prueba
app.get('/', (req, res)=>{
    res.json({mensaje:'Servidor TaskFlow funcionando'});

});

const taskRoutes = require('./routes/task.routes');
app.use('/api/v1/tasks', taskRoutes);


// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error(err);

    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Recurso no encontrado.' });
    }

    res.status(500).json({ error: 'Error interno del servidor.' });
});


//Arrancamos el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});