import { Router, Request, Response } from "express";
import { Carrito } from "../controllers/carrito.class.js";

export const routerCarrito = Router();
const carrito = new Carrito("carrito.txt");

routerCarrito.get("/",async(req:Request,res:Response)=>{
    try {
        const resp = await carrito.getCarritos();
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
});

routerCarrito.post("/",async (req:Request,res:Response)=>{
    try {
        const resp = await carrito.create({})
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})

routerCarrito.delete("/:id",async (req:Request,res:Response)=>{
    try {
        const resp = await carrito.deleteCarrito(parseInt(req.params.id))
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})

routerCarrito.post("/:id/productos",async (req:Request,res:Response)=>{
    try {
        const resp = await carrito.addToCarrito({id:req.params.id,id_prod:req.body.id_prod});
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})

routerCarrito.get("/:id/productos",async (req:Request,res:Response)=>{
    try {
        const resp = await carrito.getProductosCarrito(parseInt(req.params.id))
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})

routerCarrito.delete("/:id/productos/:id_prod",async (req:Request,res:Response)=>{
    try {
        const resp = await carrito.deleteFromCarrito({id:req.params.id,id_prod:req.params.id_prod});
        res.status(200).json(resp);
    } catch (error:any) {
        res.status(400).json(error.message);
    }
})