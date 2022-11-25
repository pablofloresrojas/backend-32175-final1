import fs from "fs"; 
import path from "path";
const __dirname = path.resolve()+"/src/data/";
import { typeCarrito,typeProducto } from '../interfaces/interfaces.js';
import { instanceOf, getMaxId } from "../functions/funciones.js";
import { Producto } from "./productos.class.js";
const productos = new Producto("productos.txt");

export class Carrito { 
    filename:string;

    constructor(filename:string){
        this.filename=filename
    }

    async create(carrito:any){
        try {
            if(fs.existsSync(path.join(__dirname) + this.filename)){
                const carritos = await this.getCarritos();
                carrito.id=1
                if(carritos.length>0){
                    const idx = getMaxId(carritos)
                    carrito.id = idx;
                }
                    carrito.timestamp =  Date.now()
                    carrito.productos=[]
                    carritos.push(carrito);
                    await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(carritos,null,2));
            }else{
                carrito.id = 1;
                carrito.timestamp = Date.now()
                carrito.productos=[]
                await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify([carrito],null,2));                
            }
            return carrito;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteCarrito(id:number){
        try {
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
            if(contenido.length>0){
                //buscar carrito por id dentro de contenido
                const carritos = (JSON.parse(contenido)).filter(carro=>carro.id!==id);
                await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(carritos,null,2));
                return `Carrido ID=${id} ha sido eliminado de la base de datos`;
            }
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async getCarritos(){
        try {
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
           if(contenido.length>0){
                //buscar carrito por id dentro de contenido
                const carritos = JSON.parse(contenido);
                return carritos;
           }else{
                return [];
           }
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async getProductosCarrito(id:number){
        try {
            let carritos:typeCarrito[]=[]
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
            if(contenido.length>0){
                carritos = JSON.parse(contenido);
            }
            const idx = carritos.findIndex((e:typeCarrito)=>e.id === id);
            if(idx===-1){                
                throw new Error(`El carrito ID=${id} no se encuentra en la base de datos.`);
            }

            let prods:any[]=[]
            await Promise.all(carritos[idx].productos.map( async (idProd)=>{
                    try {
                        const prod = await productos.getById(idProd)//.then(r=>r.data).catch(error=>{console.log("errooooor",error)})
                        console.log(`producto para agregar (${idProd}): `,prod)
                        prods.push(prod)
                        return prod
                    } catch (error:any) {
                        console.log("errooooooorrrr:",error)
                        throw new Error(error.message)
                    }
                    
            })).then(data=>{
                console.log("entrando en then para asignar prods: ",data)
                prods=data
            });
            console.log("prods: ",prods)
            return prods;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async addToCarrito(data:any){
        try {
            let carritos:typeCarrito[]=[]
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
            if(contenido.length>0){
                carritos = JSON.parse(contenido);
            }
            const idx = carritos.findIndex((e:typeCarrito)=>e.id === parseInt(data.id));
            if(idx===-1){
                throw new Error(`El carrito ID=${data.id} no se encuentra en la base de datos.`);
            }
            
            carritos[idx].productos.push(data.id_prod);
            await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(carritos,null,2));

            return `El producto ID=${data.id_prod} ha sido agregado al carrito id=${data.id}`;
            
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteFromCarrito(data:any){
        try {
            let carritos:typeCarrito[]=[]
            const contenido = await fs.promises.readFile(path.join(__dirname) + this.filename,"utf-8");
            if(contenido.length>0){
                carritos = JSON.parse(contenido);
            }
            const idx = carritos.findIndex((e:typeCarrito)=>e.id === parseInt(data.id));
            if(idx===-1){
                throw new Error(`El carrito ID=${data.id} no se encuentra en la base de datos.`);
            }
            
            carritos[idx].productos = carritos[idx].productos.filter((elemento:any)=>elemento !== parseInt(data.id_prod));
            
            await fs.promises.writeFile(path.join(__dirname) + this.filename, JSON.stringify(carritos,null,2));

            return `Producto ID=${data.id_prod} ha sido eliminado del carrito`;
            
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

}
export default Carrito;