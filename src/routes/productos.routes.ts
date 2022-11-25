import { Router, Request, Response } from "express";
import { Producto } from "../controllers/productos.class.js";

export const routerProductos = Router();
const productos = new Producto("productos.txt");

const isAdmin=true;

routerProductos.get("/",async(req:Request,res:Response)=>{
    try {
        const resp = await productos.getAll();
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(error.status).json(error.message);
    }
});

routerProductos.get("/:id",async (req:Request,res:Response)=>{
    try {
        const resp:any = await productos.getById(parseInt(req.params.id));    
        res.status(200).json(resp)
    } catch (error:any) {
          res.status(error.status).json(error.message);
    }
});

routerProductos.post("/",(req:Request,res:Response,next)=>{
    if(isAdmin){
        next()
    }else{
        res.status(400).json({error:-1,descripcion:`Ruta '${req.originalUrl}' método '${req.method}' no autorizada`})
    }
},
async (req:Request,res:Response)=>{
    try {
        const resp = await productos.save(req.body);
        res.status(200).json(resp)
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})

routerProductos.put("/:id",(req:Request,res:Response,next)=>{
        if(isAdmin){
            next()
        }else{
            res.status(400).json({error:-1,descripcion:`Ruta '${req.originalUrl}' método '${req.method}' no autorizada`})
        }
    },
    async (req,res)=>{
    try {
        const resp = await productos.update({id:req.params.id,data:req.body});
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
});

routerProductos.delete("/:id",(req:Request,res:Response,next)=>{
        if(isAdmin){
            next()
        }else{
            res.status(400).json({error:-1,descripcion:`Ruta '${req.originalUrl}' método '${req.method}' no autorizada`})
        }
    },
    async (req:Request,res:Response)=>{
        try {
            const resp:any = await productos.deleteById(parseInt(req.params.id));
            res.status(200).json(resp);
        } catch (error:any) {
            res.status(400).json(error.message);
        }
});