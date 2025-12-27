export async function retryUntilSuccess<T>(
  action: () => Promise<T>,
  {
    retries = 5,
    delayMs = 1000,
    label = "acción",
  }: {
    retries?: number;
    delayMs?: number;
    label?: string;
  } = {}
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      console.log(
        `⚠️ Falló ${label} (intento ${attempt}/${retries}). Reintentando...`
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  console.error(`❌ ${label} falló tras ${retries} intentos`);
  throw lastError;
}
