import { firefox } from "@playwright/test";
import {
  launchBrowser,
  login,
  navigateToDocumentoSoporte,
  selectProveedor,
  selectProducto,
  selectBodega,
  llenarCantidadValor,
  seleccionarCuentaContable,
} from "./utils/functions.ts";

const USER_SIIGO = process.env.USER_SIIGO;
const PASSWORD_SIIGO = process.env.PASSWORD_SIIGO;

export async function run_playwright() {
  const { browser, page } = await launchBrowser();

  await login(page, "corprecam@hotmail.com", "+Corprecam2025*");

  await navigateToDocumentoSoporte(page, "25470");
  await selectProveedor(page, " 900155107 ");

  await selectProducto(page, " ACERO ", " 014001 ");
  await selectBodega(page, " BODEGA DE RIOHACHA ");

  await llenarCantidadValor(page, "5.5", "500");

  await selectProducto(page, " ALUMINIO POTE ", "005002");
  await llenarCantidadValor(page, "10", "2500");
  await seleccionarCuentaContable(page, " CAJA RIOHACHA ");
}
