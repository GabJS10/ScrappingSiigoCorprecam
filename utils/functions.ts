import { firefox, type Page } from "@playwright/test";

async function launchBrowser() {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 768 },
  });

  return { browser, page };
}

async function login(page: Page, username: string, password: string) {
  await page.goto("https://siigonube.siigo.com/#/login");
  await page.waitForLoadState("domcontentloaded");

  const usernameInput = page.locator("#siigoSignInName");
  const passwordInput = page.locator("#siigoPassword");

  await usernameInput.fill(username);
  await passwordInput.fill(password);

  await page.click('button[type="button"]');

  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.getByRole("button", { name: "Ingresar" }).waitFor();
  await page.getByRole("button", { name: "Ingresar" }).click();

  await page.waitForLoadState("networkidle");
}

async function navigateToDocumentoSoporte(page: Page, option: string) {
  await page.getByRole("button", { name: "Crear" }).waitFor();
  await page.getByRole("button", { name: "Crear" }).click();

  await page.locator('a[data-value="Documento soporte"]').click();

  await page
    .locator('span:has-text("Tipo ")')
    .locator("xpath=../..")
    .locator("select")
    .selectOption(option);
}

async function selectProveedor(page: Page, nit: string) {
  const proveedorInput = page
    .locator('span:has-text("Proveedores")')
    .locator("xpath=../..")
    .locator('input[placeholder="Buscar"]:visible')
    .first();

  await proveedorInput.click();
  await proveedorInput.fill(nit);

  await page.locator(".suggestions tr").first().waitFor();
  await page.locator(".suggestions tr", { hasText: nit }).first().click();

  // Leer consecutivo
  const rawText = await page.locator("#lblAutomaticNumber").innerText();
  const numero = rawText.split(" ")[0];

  await page.fill('input[placeholder="Consecutivo"]', numero);

  return numero;
}

async function selectProducto(page: Page, nombre: string, codigo: string) {
  const input = page.locator(
    "#trEditRow #editProduct #autocomplete_autocompleteInput"
  );

  await input.click();
  await input.fill(nombre);

  await page.locator(".suggestions table.siigo-ac-table tr").first().waitFor();

  await page
    .locator(".siigo-ac-table tr", {
      has: page.locator(`div:text("${codigo}")`),
    })
    .first()
    .click();
}

async function selectBodega(page: Page, nombre: string) {
  const input = page.locator(
    "#trEditRow #editProductWarehouse #autocomplete_autocompleteInput"
  );

  await input.click();
  await input.fill(nombre);

  await page.locator(".suggestions table.siigo-ac-table tr").first().waitFor();

  await page
    .locator(".siigo-ac-table tr", {
      has: page.locator(`div:text("${nombre}")`),
    })
    .first()
    .click();
}

async function llenarCantidadValor(
  page: Page,
  cantidad: string,
  valor: string
) {
  const inputCantidad = page.locator(
    'siigo-inputdecimal[formcontrolname="editQuantity"] input.dx-texteditor-input'
  );
  await inputCantidad.waitFor();
  await inputCantidad.fill(cantidad);

  const inputValor = page.locator(
    'siigo-inputdecimal[formcontrolname="editUnitValue"] input.dx-texteditor-input'
  );
  await inputValor.waitFor();
  await inputValor.fill(valor);

  await page.click("#trShowNewRow");
}

async function seleccionarCuentaContable(page: Page, cuentaNombre: string) {
  const dropdownAcc = page.locator("#editingAcAccount_autocompleteInput");

  await dropdownAcc.waitFor();
  await dropdownAcc.click();

  await page.locator(".suggestions .siigo-ac-table").first().waitFor();

  await page
    .locator(
      `.suggestions .siigo-ac-table tr:has(div:has-text("${cuentaNombre}"))`
    )
    .click();
}

export {
  launchBrowser,
  login,
  navigateToDocumentoSoporte,
  selectProveedor,
  selectProducto,
  selectBodega,
  llenarCantidadValor,
  seleccionarCuentaContable,
};
