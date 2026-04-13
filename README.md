# Playwright Corprecam Automation

Este proyecto es una API de automatización construida con Node.js, Express y Playwright. Su propósito principal es actuar como un puente entre un sistema backend en PHP y el software contable **Siigo Nube**. El sistema automatiza el proceso de registro de "Documentos Soporte" ingresando programáticamente los datos de compras realizadas.

## 🚀 Características Principales

- **Servidor Express y Webhook**: Expone un endpoint HTTP (`/scrapping`) para recibir solicitudes de sincronización de compras.
- **Túnel Seguro con Ngrok**: Inicia automáticamente un túnel Ngrok para exponer el servidor local a internet y notifica al backend PHP la URL pública activa mediante el endpoint `setNgrok`.
- **Obtención y Transformación de Datos**: Consulta al backend PHP (`getCompras`, `getCompraItems`, `getMateriales`, `getMicro`) para armar el documento soporte.
- **Soporte Multi-Empresa**: Clasifica los materiales de una compra y los divide en dos entidades contables según su configuración: **Corprecam** (Empresa 1) y **Reciclemos** (Empresa 2).
- **RPA con Playwright**: Controla un navegador (Firefox/Chromium) para:
  - Iniciar sesión en Siigo Nube.
  - Navegar al módulo de Documentos Soporte.
  - Ingresar línea por línea los productos, cantidades, bodegas ("BODEGA DE RIOHACHA") y precios.
  - Asignar la cuenta contable de pago correspondiente ("CAJA RIOHACHA" o "Efectivo").
- **Manejo de Errores**: Utiliza utilidades como `retryUntilSucces` para lidiar con la asincronía y las variaciones de tiempo de carga en la interfaz web de Siigo.

## 🛠️ Arquitectura y Flujo

1. **Trigger**: El sistema PHP envía un `POST` al endpoint `/scrapping` con el ID de la compra (`{ "compra": "ID" }`).
2. **Hydration**: El servidor consulta las APIs en `https://corprecam.codesolutions.com.co/` para obtener los detalles completos.
3. **Transformación**: Se genera un objeto `DocumentoSoporte` separando los ítems para Corprecam y Reciclemos.
4. **Automatización (Bot)**: Se ejecuta la función `playwright_corprecam_reciclemos`. El bot se loguea usando las credenciales del entorno, itera sobre los ítems de la compra usando selectores dinámicos y eventos de teclado secuenciales, y guarda el registro.

## 📂 Estructura del Proyecto

- `server.ts`: Configuración del servidor Express, rutas y túnel Ngrok.
- `main.ts`: Lógica de orquestación que decide qué bot ejecutar según los productos de la compra.
- `api/php.ts`: Funciones para comunicarse con el API del sistema legado (PHP).
- `utils/transformDs.ts`: Lógica de negocio para agrupar los ítems por empresa.
- `utils/functions.ts`: Funciones core de Playwright (login, buscar productos, llenar tablas).
- `utils/retryUntilSucces.ts`: Wrapper para reintentar operaciones de Playwright propensas a fallos por carga del DOM.
- `types/types.ts`: Definición de interfaces de TypeScript.
- `playwright.config.ts`: Configuración del entorno de pruebas y automatización de Playwright.

## 💻 Prerrequisitos

- Node.js (v18 o superior)
- `npm` o `yarn`

## ⚙️ Configuración (.env)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
NGROK_AUTHTOKEN=tu_token_de_ngrok
USER_SIIGO_CORPRECAM=tu_usuario_de_siigo
PASSWORD_SIIGO_CORPRECAM=tu_password_de_siigo
```

## ▶️ Instalación y Uso

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Instala los navegadores de Playwright:
   ```bash
   npx playwright install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *Este comando levantará el servidor local, iniciará Ngrok y actualizará el webhook en el sistema remoto automáticamente.*
