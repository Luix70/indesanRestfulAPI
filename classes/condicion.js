/* Evaluador de configuraciones y condiciones de precio del ERP.
 *
 * Una configuracion es la cadena "codagrupacion" del ERP:
 *     "COLOR=6;TAPA_=50;PIE=5;"
 *
 * Una CONDICION de MODELOS_TARIFA_RST es una lista de comparaciones
 * separadas por ";" que se evaluan en AND:
 *     "TAPA_<50;TAPA_>4;COLOR=-1"
 *
 * IMPORTANTE: esta logica debe ser IDENTICA a la rutina VBA del ERP.
 * Cualquier cambio alli debe replicarse aqui (ver tests al final).
 */

// "COLOR=6;TAPA_=50;" -> { COLOR: 6, TAPA_: 50 }
function parseConfig(cadena) {
  const valores = {};
  if (!cadena) return valores;
  cadena
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .forEach((par) => {
      const idx = par.indexOf("=");
      if (idx > 0) {
        const cualidad = par.substring(0, idx).trim();
        const valor = Number(par.substring(idx + 1).trim());
        if (cualidad && !isNaN(valor)) valores[cualidad] = valor;
      }
    });
  return valores;
}

// { COLOR: 6, TAPA_: 50 } -> "COLOR=6;TAPA_=50;"  (orden alfabetico estable)
function serializeConfig(valores) {
  return (
    Object.keys(valores)
      .sort()
      .map((k) => k + "=" + valores[k])
      .join(";") + ";"
  );
}

// Un termino: "TAPA_<50", "COLOR=-1", "PIE>=3", "TAPA_<>49"
const RE_TERMINO = /^([A-Za-z0-9_ÑñÁÉÍÓÚáéíóú]+?)(<=|>=|<>|<|>|=)(-?\d+(?:[.,]\d+)?)$/;

function evaluarTermino(termino, valores) {
  const m = termino.trim().match(RE_TERMINO);
  if (!m) return { ok: false, error: "termino ilegible: " + termino };

  const cualidad = m[1].trim();
  const operador = m[2];
  const referencia = Number(m[3].replace(",", "."));
  const valor = valores[cualidad];

  // si la configuracion no incluye la cualidad, la condicion no se cumple
  if (valor === undefined) return { ok: true, cumple: false };

  var cumple = false;
  switch (operador) {
    case "=":  cumple = valor === referencia; break;
    case "<":  cumple = valor < referencia;   break;
    case ">":  cumple = valor > referencia;   break;
    case "<=": cumple = valor <= referencia;  break;
    case ">=": cumple = valor >= referencia;  break;
    case "<>": cumple = valor !== referencia; break;
  }
  return { ok: true, cumple: cumple };
}

// true si la configuracion cumple TODOS los terminos de la condicion.
// Una condicion vacia se cumple siempre.
function cumpleCondicion(condicion, valores) {
  if (!condicion || !condicion.trim()) return true;
  return condicion
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .every((t) => {
      const r = evaluarTermino(t, valores);
      return r.ok && r.cumple;
    });
}

/* Resuelve el precio de una configuracion sobre un documento simulador.
 *
 * 1. Sustituye el valor de las cualidades que definen "valorPrecio"
 *    (p.ej. COLOR muestra -> -1) por su valor efectivo.
 * 2. Evalua las reglas y elige la MAS ESPECIFICA (mas terminos) de las
 *    que se cumplen; a igualdad, la de mayor codPrecio.
 *    (( Criterio a validar contra el ERP: si el ERP usa otro orden de
 *       desempate, ajustarlo aqui. ))
 * 3. Busca el precio del codPrecio ganador en la tarifa pedida.
 */
function resolverPrecio(doc, configStr, tarifa) {
  const config = parseConfig(configStr);

  // valor efectivo para condiciones de precio
  const efectivos = Object.assign({}, config);
  doc.partes.forEach((p) => {
    if (efectivos[p.id] === undefined) return;
    const todos = (p.acabados || []).concat(p.metaValores || []);
    const acabado = todos.find((a) => a.valor === efectivos[p.id]);
    if (acabado && acabado.valorPrecio !== undefined && acabado.valorPrecio !== null) {
      efectivos[p.id] = acabado.valorPrecio;
    }
  });

  // reglas que se cumplen
  const numTerminos = (c) =>
    !c ? 0 : c.split(";").filter((s) => s.trim().length > 0).length;

  const candidatas = (doc.reglasPrecio || []).filter((r) =>
    cumpleCondicion(r.condicion, efectivos)
  );
  if (candidatas.length === 0) return null;

  candidatas.sort((a, b) => {
    const dif = numTerminos(b.condicion) - numTerminos(a.condicion);
    return dif !== 0 ? dif : b.codPrecio - a.codPrecio;
  });
  const regla = candidatas[0];

  const linea = (doc.precios || []).find(
    (p) => p.codPrecio === regla.codPrecio && p.tarifa === tarifa
  );
  if (!linea) return null;

  return {
    codPrecio: regla.codPrecio,
    condicion: regla.condicion,
    descripcion: regla.descripcion,
    tarifa: linea.tarifa,
    moneda: linea.moneda,
    precio: linea.precio,
  };
}

module.exports = {
  parseConfig,
  serializeConfig,
  cumpleCondicion,
  resolverPrecio,
};
