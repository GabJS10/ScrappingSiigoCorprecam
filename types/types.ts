import { type RowDataPacket } from "mysql2";

export interface Compra extends RowDataPacket {
  com_codigo: number;
  comp_asociado: string;
  com_micro_ruta: string;
}

export interface Micro extends RowDataPacket {
  mic_codigo: number;
  mic_nom: string;
}
export interface CompraItem extends RowDataPacket {
  citem_codigo: number;
  citem_id_compra: number;
  citem_material: number;
  citem_cantidad: number;
  citem_valor_unitario: number;
  citem_total: number;
  citem_rechazo: number;
}

export interface Material extends RowDataPacket {
  mat_id: number;
  mat_codigo: string;
  mat_nom: string;
  emp_id_fk: number;
}
export interface Micro extends RowDataPacket {
  mic_nom: string;
}

export interface Products {
  codigo: string;
  cantidad: number;
  precio: number;
}

export interface DocumentoSoporte {
  proveedor_id: string;
  micro_id: string;
  productos: Products[];
}
