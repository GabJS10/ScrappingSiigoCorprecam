import express from "express";
import { run_playwright } from "./main.ts";
import * as ngrok from "@ngrok/ngrok";
import { config } from "./config.ts";
import cors from "cors";
import { transfromDs } from "./utils/transformDs.ts";
const app = express();
import {
  getCompras,
  getCompraItems,
  getMateriales,
  getMicro,
  setNgrok,
} from "./api/php.ts";

//https://corprecam.codesolutions.com.co/
app.use(cors());

app.use(express.json());

app.post("/scrapping", async (req, res) => {
  const body = req.body;

  const compra = await getCompras(body.compra);

  const compraItems = await getCompraItems(body.compra);

  const citem_material = compraItems.map((row) => row.citem_material);

  const materiales = await getMateriales(citem_material);

  const micro = await getMicro(Number(compra[0].com_micro_ruta));

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

  await setNgrok(listener.url());
});
