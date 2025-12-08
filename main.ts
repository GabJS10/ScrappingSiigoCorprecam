import { firefox } from "@playwright/test";
import {
  launchBrowser,
  login,
  selectProducto,
  selectBodega,
  llenarCantidadValor,
  seleccionarPago,
} from "./utils/functions.ts";
import type { DocumentoSoporte } from "./types/types.ts";
import { config } from "./config.ts";

const documentoSoporteLabelCode = "25470";

const bodegaRiohacha = " BODEGA DE RIOHACHA ";

const cuentaContable = " CAJA RIOHACHA ";

export async function run_playwright(documentoSoporte: DocumentoSoporte) {
  const { browser, page } = await launchBrowser();

  /*
  await login(page, "corprecam@hotmail.com", "+Corprecam2025*");

  await navigateToDocumentoSoporte(page, "25470");
  await selectProveedor(page, " 900155107 ");

  await selectProducto(page, " ACERO ", " 014001 ");
  await selectBodega(page, " BODEGA DE RIOHACHA ");

  await llenarCantidadValor(page, "5.5", "500");

  await selectProducto(page, " ALUMINIO POTE ", "005002");
  await llenarCantidadValor(page, "10", "2500");
  await seleccionarCuentaContable(page, " CAJA RIOHACHA ");
  */

  if (documentoSoporte.corprecam.length > 0) {
    await login(
      page,
      config.USER_SIIGO_CORPRECAM,
      config.PASSWORD_SIIGO_CORPRECAM,
      documentoSoporteLabelCode,
      documentoSoporte.proveedor_id
    );

    for (const product of documentoSoporte.corprecam) {
      await selectProducto(page, product.codigo);
      await selectBodega(page, bodegaRiohacha);
      await llenarCantidadValor(page, product.cantidad, product.precio);
    }

    await seleccionarPago(page, cuentaContable, browser);
  }

  /*
  if (documentoSoporte.reciclemos.length > 0) {
    await login(
      page,
      USER_SIIGO_RECICLEMOS,
      PASSWORD_SIIGO_RECICLEMOS,
      documentoSoporteLabelCode,
      documentoSoporte.proveedor_id
    );

    for (const product of documentoSoporte.reciclemos) {
      await selectProducto(page, product.codigo);
      await selectBodega(page, bodegaRiohacha);
      await llenarCantidadValor(page, product.cantidad, product.precio);
    }

    await seleccionarPago(page, cuentaContable, browser);
  }
  
  */
}
