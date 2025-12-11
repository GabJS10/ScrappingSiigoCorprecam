import { launchBrowser } from "./utils/functions.ts";
import type { DocumentoSoporte } from "./types/types.ts";
import { config } from "./config.ts";
import { playwright_corprecam_reciclemos } from "./utils/transformDs.ts";

const documentoSoporteLabelCode = "25470";

const bodegaRiohacha = " BODEGA DE RIOHACHA ";

const cuentaContable = " CAJA RIOHACHA ";

export async function run_playwright(documentoSoporte: DocumentoSoporte) {
  const { page } = await launchBrowser();

  console.log(documentoSoporte.corprecam);
  console.log(documentoSoporte.reciclemos);

  await playwright_corprecam_reciclemos(
    page,
    documentoSoporte.corprecam,
    documentoSoporteLabelCode,
    bodegaRiohacha,
    cuentaContable,
    documentoSoporte.proveedor_id,
    config.USER_SIIGO_CORPRECAM,
    config.PASSWORD_SIIGO_CORPRECAM
  );

  /*
  await playwright_corprecam_reciclemos(
    page,
    documentoSoporte.reciclemos,
    documentoSoporteLabelCode,
    bodegaRiohacha,
    cuentaContable,
    documentoSoporte.proveedor_id,
    config.USER_SIIGO_RECICLEMOS,
    config.PASSWORD_SIIGO_RECICLEMOS
  );
   */
}
