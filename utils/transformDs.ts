import { type Page } from "@playwright/test";
import {
  type Compra,
  type CompraItem,
  type Material,
  type Micro,
  type DocumentoSoporte,
  type Products as P,
} from "../types/types.ts";
import { agregarEspacios } from "./agregarEspacios.ts";
import {
  llenarCantidadValor,
  login,
  prepararNuevaFila,
  seleccionarPago,
  selectBodega,
  selectProducto,
} from "./functions.ts";
import { config } from "../config.ts";
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
): DocumentoSoporte {
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

  return {
    proveedor_id: compra.comp_asociado,
    micro_id: String(micros.mic_nom) || "",
    corprecam: corprecam,
    reciclemos: reciclemos,
  };
}

export async function playwright_corprecam_reciclemos(
  page: Page,
  documentoSoporte: P[],
  documentoSoporteLabelCode: string,
  bodegaRiohacha: string,
  cuentaContable: string,
  proveedor_id: string,
  USER: string,
  PASSWORD: string
) {
  if (documentoSoporte.length > 0) {
    await login(page, USER, PASSWORD, documentoSoporteLabelCode, proveedor_id);

    for (let i = 0; i < documentoSoporte.length; i++) {
      await prepararNuevaFila(page);

      await selectProducto(page, documentoSoporte[i].codigo);

      if (i === 0) {
        await selectBodega(page, bodegaRiohacha);
      }

      await llenarCantidadValor(
        page,
        documentoSoporte[i].cantidad,
        documentoSoporte[i].precio
      );
    }

    await seleccionarPago(page, cuentaContable);
  }
}
