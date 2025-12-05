import {
  type Compra,
  type CompraItem,
  type Material,
  type Micro,
} from "../types/types.ts";

export async function getCompras(com_codigo: string): Promise<Compra[]> {
  const res = await fetch(
    `https://corprecam.codesolutions.com.co/administrativo/get_compra.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ com_codigo }),
    }
  );

  const compra = await res.json();

  return compra;
}

export async function getCompraItems(
  com_codigo: string
): Promise<CompraItem[]> {
  const res = await fetch(
    `https://corprecam.codesolutions.com.co/administrativo/get_compra_items.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ compra: com_codigo }),
    }
  );

  const compraItems = await res.json();

  return compraItems;
}

export async function getMateriales(ids: number[]): Promise<Material[]> {
  const res = await fetch(
    `https://corprecam.codesolutions.com.co/administrativo/get_materiales.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    }
  );

  const materiales = await res.json();

  return materiales;
}

export async function getMicro(com_micro_ruta: number): Promise<Micro> {
  const res = await fetch(
    `https://corprecam.codesolutions.com.co/administrativo/get_microruta.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo: com_micro_ruta }),
    }
  );

  const micro = await res.json();

  return micro;
}

export async function setNgrok(link: string | null): Promise<any> {
  await fetch(
    `https://corprecam.codesolutions.com.co/administrativo/set_ngrok.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link }),
    }
  );
}
