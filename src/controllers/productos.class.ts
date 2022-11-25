import fs from "fs"; 
import path from "path";
const __dirname = path.resolve()+"/src/data/";
import { typeProducto } from '../interfaces/interfaces.js';
import { instanceOf, getMaxId } from "../functions/funciones.js";

export class Producto { 

    filename:string;

    constructor(filename:string){
        this.filename=filename
    }

    async save(producto:any){
        try {

            if(instanceOf<typeProducto>(producto,"nombre") &&
               instanceOf<typeProducto>(producto,"descripcion") &&
               instanceOf<typeProducto>(producto,"codigo") &&
               instanceOf<typeProducto>(producto,"fotoUrl") &&
               instanceOf<typeProducto>(producto,"precio") && 
               instanceOf<typeProducto>(producto,"stock")){
                console.log("cumple formato")
            }else{
                throw new Error("Objeto no cumple con el formato requerido {nombre,descripcion,codigo,fotoUrl,precio,stock}");
            }
            if(fs.existsSync(path.join(__dirname) + this.filename)){
                
                const productos = await this.getAll();
                if(productos.length>0){
                    const idx = getMaxId(productos)
                    producto.id = idx;
                    producto.timestamp =  Date.now()
                    productos.push(producto);
                    await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(productos,null,2));
                }else{
                    producto.id = 1;
                    producto.timestamp = Date.now()
                    await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify([producto],null,2));
                }
            }else{
                producto.id = 1;
                producto.timestamp = Date.now()
                await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify([producto],null,2));                
            }
            return producto;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async update(producto:any){
        try {

            let productos:typeProducto[]=[]
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
            if(contenido.length>0){
                productos = JSON.parse(contenido);
            }
            const idx = productos.findIndex((e:typeProducto)=>e.id === parseInt(producto.id));
            if(idx===-1){
                throw new Error(`Producto ID=${producto.id} no se encuentra en la base de datos.`);
            }

            productos[idx].nombre=producto.data.nombre;
            productos[idx].descripcion=producto.data.descripcion;
            productos[idx].fotoUrl=producto.data.fotoUrl;
            productos[idx].codigo=producto.data.codigo;
            productos[idx].precio=producto.data.precio;
            productos[idx].stock=producto.data.stock;

            await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(productos,null,2));

            return productos[idx];

        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async getAll(){
        try {
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
           if(contenido.length>0){
                const productos = JSON.parse(contenido);
                return productos;
           }else{
                return "No hay productos en la base de datos";
           }
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async getById(id:number){
        try {
            const resp = await this.getAll();
            const producto = resp.find((elemento:any)=>{return elemento.id === id});
            if(producto)
                return producto;
            else
                return `Producto ID=${id}no encontrado`;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteById(id:number){
        try {
            const prods = await this.getAll();
            const newProducts = await prods.filter((elemento:any)=>elemento.id !== id);
            await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(newProducts,null,2));
            return `Producto ID=${id} ha sido eliminado de la base de datos`;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify([],null,2));
            return "Se han eliminado todos los productos de la base de datos";
        } catch (error) {
            return "error al eliminar los productos de la base de datos";
        }
    }

}