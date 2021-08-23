export class typeheadArray{
    
    codigo: string;
    descripcion: string;
    mouseOver: boolean

    constructor (_codigo:string,_descripcion:string, _mouseOver:boolean){
        this.codigo = _codigo;
        this.descripcion = _descripcion;
        this.mouseOver = _mouseOver;
    }
}