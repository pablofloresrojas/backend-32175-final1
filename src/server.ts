import express, { Express } from 'express';
import { routerProductos } from './routes/productos.routes.js';
import { routerCarrito } from './routes/carrito.routes.js';

const app:Express = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = 8080;

const server = app.listen( PORT, ()=>{
    console.log(`Servidor escuchando el puerto: ${PORT}`);
});

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

// error 404 ruta no encontrada
app.use((req, res, next) => {
    console.log("ruta 404")
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({error:-2,descripcion:`Ruta '${req.originalUrl}' método '${req.method}' no implementada`});
});