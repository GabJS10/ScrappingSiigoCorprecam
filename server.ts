import express from "express";
import { run_playwright } from "./main.ts";
import * as ngrok from "@ngrok/ngrok";
import { config } from "./config.ts";
import { conn } from "./db/config.ts";
import cors from "cors";
import {
  type Material,
  type CompraItem,
  type Compra,
  type Micro,
} from "./types/types.ts";
import { transfromDs } from "./utils/transformDs.ts";
const app = express();

const db = await conn();
//https://corprecam.codesolutions.com.co/
app.use(cors());

app.use(express.json());

app.post("/scrapping", async (req, res) => {
  const body = req.body;

  const [compra] = await db.query<Compra[]>(
    "SELECT * FROM compra WHERE com_codigo = ?",
    [body.compra]
  );

  const [compraItems] = await db.query<CompraItem[]>(
    "SELECT * FROM compra_item WHERE citem_id_compra = ?",
    [body.compra]
  );

  const citem_material = compraItems.map((row) => row.citem_material);

  const placeholders = citem_material.map(() => "?").join(",");

  const [materiales] = await db.query<Material[]>(
    "SELECT * FROM material WHERE mat_id IN (" + placeholders + ")",
    citem_material
  );

  const [micro] = await db.query<Micro[]>(
    "SELECT * FROM micro_ruta WHERE mic_codigo = ?",
    [compra[0].com_micro_ruta]
  );

  const ds = transfromDs(compra[0], compraItems, materiales, micro);

  console.log(JSON.stringify(ds));

  return res.json({
    message: "ok",
  });
});

app.listen(config.PORT, async () => {
  console.log(`Server running on port ${config.PORT}`);

  const listener = await ngrok.forward({
    addr: 3000,
    authtoken: config.NGROK_AUTHTOKEN,
  });

  await db.execute("DELETE FROM ngrok_link");

  await db.execute("INSERT INTO ngrok_link (link) VALUES (?)", [
    listener.url(),
  ]);
});
