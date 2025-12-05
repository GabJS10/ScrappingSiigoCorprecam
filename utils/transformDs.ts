import {
  type Compra,
  type CompraItem,
  type Material,
  type Micro,
  type DocumentoSoporte,
} from "../types/types.ts";

interface Products {
  codigo: string;
  cantidad: number;
  precio: number;
  empresa: number | undefined;
}

export function transfromDs(
  compra: Compra,
  compraItems: CompraItem[],
  materiales: Material[],
  micros: Micro
): DocumentoSoporte[] {
  const productos = compraItems.map((item): Products => {
    const material = materiales.find(
      (material) => material.mat_id === item.citem_material
    );
    return {
      codigo: material?.mat_codigo || "",
      cantidad: item.citem_cantidad,
      precio: item.citem_valor_unitario,
      empresa: material?.emp_id_fk,
    };
  });

  // const productosCorprecam = productos.filter((pro) => pro.empresa === 1);
  //const productosReciclemos = productos.filter((pro) => pro.empresa === 2);

  const [corprecam, reciclemos] = productos.reduce(
    (acc: [Array<Products>, Array<Products>], pro: Products) => {
      if (pro.empresa === 1) {
        acc[0].push(pro);
      } else {
        acc[1].push(pro);
      }
      return acc;
    },
    [[], []]
  );

  return [
    {
      proveedor_id: compra.comp_asociado,
      micro_id: String(micros.mic_nom) || "",
      corprecam: corprecam,
      reciclemos: reciclemos,
    },
  ];
}
