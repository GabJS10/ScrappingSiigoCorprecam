import { launchBrowser } from "./utils/functions.ts";
import type { DocumentoSoporte } from "./types/types.ts";
import { config } from "./config.ts";
import { playwright_corprecam_reciclemos } from "./utils/transformDs.ts";

const documentoSoporteLabelCode = "25470";

const bodegaRiohacha = " BODEGA DE RIOHACHA ";

const cuentaContableCorprecam = " CAJA RIOHACHA ";
const cuentaContableReciclemos = " Efectivo ";
export async function run_playwright(documentoSoporte: DocumentoSoporte) {
  console.log(documentoSoporte.corprecam);
  console.log(documentoSoporte.reciclemos);

  if (documentoSoporte.corprecam.length > 0) {
    await playwright_corprecam_reciclemos(
      documentoSoporte.corprecam,
      documentoSoporteLabelCode,
      bodegaRiohacha,
      cuentaContableCorprecam,
      documentoSoporte.proveedor_id,
      config.USER_SIIGO_CORPRECAM,
      config.PASSWORD_SIIGO_CORPRECAM,
      "900142913"
    );
  }

  if (documentoSoporte.reciclemos.length > 0) {
    await playwright_corprecam_reciclemos(
      documentoSoporte.reciclemos,
      documentoSoporteLabelCode,
      bodegaRiohacha,
      cuentaContableReciclemos,
      documentoSoporte.proveedor_id,
      config.USER_SIIGO_CORPRECAM,
      config.PASSWORD_SIIGO_CORPRECAM,
      "901328575"
    );
  }
}
