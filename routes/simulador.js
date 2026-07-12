/* Modulo de enrutamiento del simulador de acabados.
 *
 *   GET  /simulador/precio/:sku?config=COLOR%3D6%3BTAPA_%3D50%3B&tarifa=A2026
 *   GET  /simulador/:lan/:sku          configuracion del articulo (idioma con fallback a es)
 *   POST /simulador/publicar           upsert desde el ERP (requiere token)
 */

const express = require("express");
const router = express.Router();
const auth_mw = require("../middleware/auth_mw");
const sim = require("../models/simulador.js");
const cond = require("../classes/condicion.js");

// FUNCIONES AUXILIARES

// texto multiidioma con fallback a español
function t(obj, lan) {
  if (!obj) return "";
  return obj[lan] || obj.es || "";
}

function proyectarAcabado(a, lan) {
  return {
    valor: a.valor,
    nombre: t(a.nombre, lan),
    textura: a.textura || "",
    hex: a.hex || "",
  };
}

// proyecta un documento al idioma pedido
function proyectar(doc, lan) {
  return {
    sku: doc.sku,
    nombre: t(doc.nombre, lan),
    coleccion: doc.coleccion,
    dims: doc.dims,
    modelo3d: doc.modelo3d || "",
    publicadoEl: doc.publicadoEl,
    partes: (doc.partes || [])
      .slice()
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .map((p) => ({
        id: p.id,
        orden: p.orden,
        etiqueta: t(p.etiqueta, lan),
        requerida: p.requerida,
        afectaPrecio: p.afectaPrecio,
        fuente: p.fuente,
        acabados: (p.acabados || []).map((a) => proyectarAcabado(a, lan)),
        metaValores: (p.metaValores || []).map((a) => proyectarAcabado(a, lan)),
      })),
  };
}

// RUTAS

// precio de una configuracion (ha de ir antes de /:lan/:sku)
router.get("/precio/:sku", async (req, res) => {
  const sku = req.params.sku;
  const config = req.query.config || "";
  const tarifa = req.query.tarifa;
  const lan = (req.query.lan || "es").toLowerCase();

  if (!tarifa) return res.status(400).send("Falta el parametro 'tarifa'");
  if (!config) return res.status(400).send("Falta el parametro 'config'");

  const doc = await sim.Simulador.findOne({ sku: sku });
  if (!doc) return res.status(404).send("Articulo no publicado: " + sku);

  const resultado = cond.resolverPrecio(doc, config, tarifa);
  if (!resultado) {
    return res
      .status(404)
      .send("Sin precio para esa configuracion/tarifa: " + config + " / " + tarifa);
  }

  res.json({
    sku: sku,
    config: config,
    codPrecio: resultado.codPrecio,
    descripcion: t(resultado.descripcion, lan),
    tarifa: resultado.tarifa,
    moneda: resultado.moneda,
    precio: resultado.precio,
  });
});

// configuracion del simulador para un articulo
router.get("/:lan/:sku", async (req, res) => {
  const lan = req.params.lan.toLowerCase();
  const sku = req.params.sku;

  const doc = await sim.Simulador.findOne({ sku: sku });
  if (!doc) {
    return res
      .status(404)
      .send("<h1>No encontrado / pas trouvé / not found / nicht gefunden</h1>");
  }
  res.json(proyectar(doc, lan));
});

// publicacion desde el ERP: un documento o un array de documentos
router.post("/publicar", auth_mw, async (req, res) => {
  const docs = Array.isArray(req.body) ? req.body : [req.body];
  const resultado = { publicados: [], errores: [] };

  for (const d of docs) {
    if (!d || !d.sku) {
      resultado.errores.push({ sku: d && d.sku, error: "falta sku" });
      continue;
    }
    try {
      d.publicadoEl = new Date();
      await sim.Simulador.findOneAndUpdate({ sku: d.sku }, d, {
        upsert: true,
        new: true,
        runValidators: true,
      });
      resultado.publicados.push(d.sku);
    } catch (er) {
      resultado.errores.push({ sku: d.sku, error: er.message });
    }
  }

  res.status(resultado.errores.length ? 207 : 200).json(resultado);
});

// listado de articulos publicados (para depuracion / panel interno)
router.get("/", async (req, res) => {
  const docs = await sim.Simulador.find({}, "sku nombre.es coleccion publicadoEl");
  res.json(docs);
});

module.exports = router;
