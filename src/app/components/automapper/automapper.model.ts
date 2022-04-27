import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

//Mapeo para consulta de pedidos
import { order } from "src/app/pages/models/order.model";
import { orderTF } from '../models/orderTF.model';


export const mapper = createMapper({
  name: 'someName',
  pluginInitializer: classes,
});


mapper.createMap(order, orderTF);
