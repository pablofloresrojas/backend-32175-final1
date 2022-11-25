export interface typeProducto{
    id:number,
    timestamp:number,
    nombre:string,
    descripcion:string,
    codigo:string,
    fotoUrl:string,
    precio:number,
    stock:number
}

export interface typeCarrito{
    id:number,
    timestamp:number,
    productos:any[]
}