import { AutoMap } from "@automapper/classes";

export class orderTF{
    @AutoMap()
    id:string;
    
    razonSocial:string;
    @AutoMap()
    fecha:Date;
    @AutoMap()
    direccionEntrega:string;

    importe:number
}


