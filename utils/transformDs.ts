import {
  type Compra,
  type CompraItem,
  type Material,
  type Micro,
  type DocumentoSoporte,
} from "../types/types.ts";

export function transfromDs(
  compra: Compra,
  compraItems: CompraItem[],
  materiales: Material[],
  micros: Micro[]
): DocumentoSoporte[] {
  const productos = compraItems.map((item) => {
    const material = materiales.find(
      (material) => material.mat_id === item.citem_material
    );
    return {
      codigo: material?.mat_codigo || "",
      cantidad: item.citem_cantidad,
      precio: item.citem_valor_unitario,
    };
  });

  return [
    {
      proveedor_id: compra.comp_asociado,
      micro_id: String(micros[0].mic_nom) || "",
      productos,
    },
  ];
}
