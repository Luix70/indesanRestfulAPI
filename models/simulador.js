const mongoose = require("mongoose");

/* Modelo de datos del simulador de acabados.
 * Un documento por articulo (sku), publicado desde el ERP (Access)
 * mediante POST /simulador/publicar.
 *
 * Fuente en el ERP:
 *   partes        <- CUALIDAD_ARTICULO_RST (+ CUALIDADES_VALOR_RST / colores)
 *   reglasPrecio  <- MODELOS_TARIFA_RST (CodPrecio + CONDICION)
 *   precios       <- PRECIOS_TARIFA_RST (tarifas publicables)
 */

const textoMultiSchema = new mongoose.Schema(
  {
    es: { type: String, required: true, default: "" },
    fr: { type: String, default: "" },
    en: { type: String, default: "" },
    de: { type: String, default: "" },
  },
  { _id: false }
);

const acabadoSchema = new mongoose.Schema(
  {
    valor: { type: Number, required: true }, // CodValor o colores.NUMERO
    // valor efectivo al evaluar CONDICION (p.ej. color muestra -> -1).
    // Si no se indica, se usa "valor".
    valorPrecio: { type: Number },
    nombre: { type: textoMultiSchema, default: () => ({}) },
    textura: { type: String, default: "" }, // url de textura/muestra (DAM)
    hex: { type: String, default: "" }, // color aproximado para el swatch
    categoria: { type: Number }, // colores.TipoTarifa
  },
  { _id: false }
);

const parteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // CodCualidad: "TAPA_", "COLOR", "PIE"...
    orden: { type: Number, default: 0 },
    etiqueta: { type: textoMultiSchema, default: () => ({}) }, // AsociadoA*
    requerida: { type: Boolean, default: false },
    afectaPrecio: { type: Boolean, default: false },
    fuente: { type: String, default: "cualidades" }, // "cualidades" | "colores"
    acabados: { type: [acabadoSchema], default: [] },
    metaValores: { type: [acabadoSchema], default: [] }, // <SIN COLOR>, A JUEGO...
  },
  { _id: false }
);

const reglaPrecioSchema = new mongoose.Schema(
  {
    codPrecio: { type: Number, required: true },
    condicion: { type: String, default: "" }, // "TAPA_<50;TAPA_>4;COLOR=-1"
    descripcion: { type: textoMultiSchema, default: () => ({}) },
    exportable: { type: Boolean, default: true },
  },
  { _id: false }
);

const precioSchema = new mongoose.Schema(
  {
    codPrecio: { type: Number, required: true },
    tarifa: { type: String, required: true }, // "A2026"...
    moneda: { type: String, default: "EUR" },
    precio: { type: Number, required: true },
  },
  { _id: false }
);

const simuladorSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: textoMultiSchema, default: () => ({}) },
  coleccion: { type: String, default: "" },
  dims: {
    largo: Number,
    ancho: Number,
    alto: Number,
    extendida: Number,
  },
  modelo3d: { type: String, default: "" }, // url del GLB (fase 3D)
  partes: { type: [parteSchema], default: [] },
  reglasPrecio: { type: [reglaPrecioSchema], default: [] },
  precios: { type: [precioSchema], default: [] },
  publicadoEl: { type: Date, default: Date.now },
});

const Simulador = mongoose.model("simuladores", simuladorSchema);

module.exports.Simulador = Simulador;
