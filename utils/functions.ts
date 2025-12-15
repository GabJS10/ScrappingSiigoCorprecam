import { firefox, type Page, type Browser, expect } from "@playwright/test";

async function launchBrowser() {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 768 },
  });

  return { browser, page };
}

async function login(
  page: Page,
  username: string,
  password: string,
  documentoSoporteLabelCode: string,
  nit: string,
  nit_empresa: string
) {
  console.log(username, password, documentoSoporteLabelCode, nit);

  await page.goto("https://siigonube.siigo.com/#/login");
  await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

  const usernameInput = page.locator("#siigoSignInName");
  const passwordInput = page.locator("#siigoPassword");

  await usernameInput.fill(username);
  await passwordInput.fill(password);

  await page.click('button[type="button"]');

  await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

  await page
    .locator("tr", { hasText: nit_empresa })
    .locator("button", { hasText: "Ingresar" })
    .waitFor();

  await page
    .locator("tr", { hasText: nit_empresa })
    .locator("button", { hasText: "Ingresar" })
    .click();

  await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

  await page.getByRole("button", { name: "Crear" }).waitFor();
  await page.getByRole("button", { name: "Crear" }).click();

  await page.locator('a[data-value="Documento soporte"]').waitFor();

  await page.locator('a[data-value="Documento soporte"]').click();

  if (nit_empresa === "900142913") {
    await page
      .locator('span:has-text("Tipo ")')
      .locator("xpath=../..")
      .locator("select")
      .selectOption(documentoSoporteLabelCode);
  }
  const proveedorInput = page
    .locator('span:has-text("Proveedores")')
    .locator("xpath=../..")
    .locator('input[placeholder="Buscar"]:visible')
    .first();

  await proveedorInput.click();

  await page.locator(".suggestions tr").first().waitFor();

  await proveedorInput.pressSequentially(nit);

  await page.locator(".suggestions tr", { hasText: nit }).first().waitFor();

  await page.locator(".suggestions tr", { hasText: nit }).first().click();

  // Leer consecutivo
  const rawText = await page.locator("#lblAutomaticNumber").innerText();
  const numero = rawText.split(" ")[0];

  await page.fill('input[placeholder="Consecutivo"]', numero);
}

async function selectProducto(page: Page, codigo: string) {
  // Ya sabemos que está visible gracias a prepararNuevaFila,
  // pero mantenemos el selector robusto
  const input = page.locator(
    "#trEditRow #editProduct #autocomplete_autocompleteInput"
  );

  await input.click();
  await input.clear(); // Limpiamos cualquier basura anterior

  // Escribimos despacio para que Angular detecte las teclas
  await input.pressSequentially(codigo, { delay: 150 });

  // Esperamos sugerencias
  await page.locator(".siigo-ac-table tr").first().waitFor();

  // Seleccionamos
  await page
    .locator(".siigo-ac-table tr", {
      has: page.locator(`div:text-is("${codigo}")`),
    })
    .first()
    .waitFor();

  await page
    .locator(".siigo-ac-table tr", {
      has: page.locator(`div:text-is("${codigo}")`),
    })
    .first()
    .click();
}

async function selectBodega(page: Page, nombre: string) {
  const input = page.locator(
    "#trEditRow #editProductWarehouse #autocomplete_autocompleteInput"
  );

  await input.click();

  await page.locator(".suggestions table.siigo-ac-table tr").first().waitFor();

  await page
    .locator(".siigo-ac-table tr", {
      has: page.locator(`div:text("${nombre}")`),
    })
    .first()
    .click();
}

export async function prepararNuevaFila(page: Page) {
  const inputBusqueda = page.locator(
    "#trEditRow #editProduct #autocomplete_autocompleteInput"
  );
  const botonAgregar = page.locator("#new-item, #new-item-text").first();

  // Paso 1: Verificamos si el input YA está visible y listo.
  if (await inputBusqueda.isVisible()) {
    // Si está visible, verificamos que no esté inhabilitado
    if (await inputBusqueda.isEnabled()) {
      return; // Todo listo, no hacemos nada
    }
  }

  // Paso 2: Si el input está oculto o no existe, significa que la fila no se abrió.
  // Hacemos clic en el botón para abrirla.
  console.log("Input oculto o no listo. Forzando apertura de nueva fila...");

  // Aseguramos que el botón de agregar esté visible antes de clickear
  if (await botonAgregar.isVisible()) {
    await botonAgregar.click({ force: true });
  }

  // Paso 3: Esperamos explícitamente a que el input aparezca tras el clic
  try {
    await inputBusqueda.waitFor({ state: "visible", timeout: 10000 });
  } catch (e) {
    // Si falla, a veces ayuda un segundo clic de seguridad (doble check)
    console.log("Reintentando clic en agregar ítem...");
    await botonAgregar.click({ force: true });
    await inputBusqueda.waitFor({ state: "visible", timeout: 10000 });
  }
}

async function llenarCantidadValor(
  page: Page,
  cantidad: number,
  valor: number
) {
  // 1. Definimos los inputs
  const inputCantidad = page.locator(
    'siigo-inputdecimal[formcontrolname="editQuantity"] input.dx-texteditor-input'
  );
  const inputValor = page.locator(
    'siigo-inputdecimal[formcontrolname="editUnitValue"] input.dx-texteditor-input'
  );

  // 2. Esperamos que el input de cantidad esté visible y limpio (listo para escribir)
  await inputCantidad.waitFor({ state: "visible" });
  await inputCantidad.fill(cantidad.toString());

  // 3. Llenamos el valor
  await inputValor.fill(valor.toString());

  // 4. CLICK EN AGREGAR (Aquí estaba tu error de sintaxis)
  // Usamos getByText o el ID directo. Es mucho más limpio y no falla el parser.
  // Primero intentamos por ID, si no, busca por texto.
  const botonAgregar = page
    .locator("#new-item")
    .or(page.getByText("Agregar otro ítem"))
    .first();

  await botonAgregar.waitFor({ state: "visible" });
  await botonAgregar.click({ force: true });

  // 5. EL PASO CLAVE PARA QUE FUNCIONE EL LOOP:
  // Esperamos a que el input de cantidad DESAPAREZCA o SE LIMPIE.
  // Esto confirma que Siigo "tragó" la línea y está reseteando la fila para el siguiente producto.
  // Sin esto, el siguiente ciclo intenta escribir mientras el input sigue lleno.

  // Opción A: Esperar a que el valor sea vacío (Si Siigo limpia el input)
  await expect(inputCantidad)
    .toHaveValue("", { timeout: 10000 })
    .catch(() => {
      console.log("El input no se limpió automáticamente, forzando espera...");
    });

  // Opción B (Más segura en Siigo): Esperar un pequeño respiro del DOM
  await page.waitForTimeout(1000);
}

async function seleccionarPago(page: Page, cuentaNombre: string) {
  const dropdownAcc = page.locator("#editingAcAccount_autocompleteInput");

  await dropdownAcc.waitFor({ timeout: 10000 });
  await dropdownAcc.click();

  await page.locator(".suggestions .siigo-ac-table").first().waitFor();

  await page
    .locator(
      `.suggestions .siigo-ac-table tr:has(div:has-text("${cuentaNombre}"))`
    )
    .click();

  //out
  await page.close();
}

export {
  launchBrowser,
  login,
  selectProducto,
  selectBodega,
  llenarCantidadValor,
  seleccionarPago,
};
