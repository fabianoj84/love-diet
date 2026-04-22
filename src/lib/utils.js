import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function toNumber(value) {
  if (typeof value === "number") return value;
  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  const normalized = raw.replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}

export function inferUnit(tipo) {
  if (!tipo) return "g";
  const t = String(tipo).toLowerCase();
  if (t.includes("ml")) return "ml";
  return "g";
}

export function inferBaseAmount(tipo) {
  const match = String(tipo ?? "").match(/(\d+(?:[.,]\d+)?)/);
  return match ? toNumber(match[1]) : 100;
}

export function roundToStep(value, step) {
  if (!Number.isFinite(value) || step <= 0) return value;
  return Math.round(value / step) * step;
}

export function getStep(unit, value) {
  if (unit === "ml") return value > 100 ? 10 : 5;
  return 5;
}

function normalizeText(text) {
  return String(text ?? "").trim();
}

function normalizeHeader(text) {
  return normalizeText(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findIndex(headers, possibilities) {
  const normalizedHeaders = headers.map(normalizeHeader);

  for (const possibility of possibilities) {
    const target = normalizeHeader(possibility);
    const index = normalizedHeaders.findIndex((header) => header === target);
    if (index >= 0) return index;
  }

  return -1;
}

function detectDelimiter(text) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sample = lines[0] || "";

  if (sample.includes("\t")) return "\t";

  const commaCount = (sample.match(/,/g) || []).length;
  const semicolonCount = (sample.match(/;/g) || []).length;

  if (semicolonCount > commaCount) return ";";
  if (commaCount > 0) return ",";

  return "spaces";
}

function parseDelimitedLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function splitFlexible(line, delimiterMode) {
  if (delimiterMode === "\t") {
    return line.split("\t").map((part) => part.trim());
  }

  if (delimiterMode === ",") {
    return parseDelimitedLine(line, ",");
  }

  if (delimiterMode === ";") {
    return parseDelimitedLine(line, ";");
  }

  return line.split(/\s{2,}/).map((part) => part.trim());
}

function escapeCsvValue(value, delimiter = ",") {
  const text = String(value ?? "");
  const mustQuote =
    text.includes(delimiter) || text.includes('"') || text.includes("\n");

  const escaped = text.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

export function parseCsv(text) {
  const rawLines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rawLines.length) {
    throw new Error("Cole um CSV antes de calcular.");
  }

  const delimiterMode = detectDelimiter(text);
  const rows = rawLines.map((line) => splitFlexible(line, delimiterMode));
  const firstRow = rows[0] || [];

  const hasHeader =
    firstRow.some((cell) => normalizeHeader(cell).includes("grupo")) ||
    firstRow.some((cell) => normalizeHeader(cell).includes("alimento"));

  const headers = hasHeader
    ? firstRow
    : [
        "Grupo",
        "Alimento",
        "Descrição",
        "Energia (kcal)",
        "Carboidratos (g)",
        "Proteína (g)",
        "Lipídios (g)",
        "Tipo",
      ];

  const dataRows = hasHeader ? rows.slice(1) : rows;

  const idxGrupo = findIndex(headers, ["Grupo"]);
  const idxAlimento = findIndex(headers, ["Alimento", "Nome"]);
  const idxDescricao = findIndex(headers, ["Descrição", "Descricao"]);
  const idxKcal = findIndex(headers, ["Energia (kcal)", "Energia", "Kcal"]);
  const idxCarbo = findIndex(headers, [
    "Carboidratos (g)",
    "Carboidratos",
    "Carbo",
  ]);
  const idxProteina = findIndex(headers, [
    "Proteína (g)",
    "Proteina (g)",
    "Proteína",
    "Proteina",
  ]);
  const idxLipidio = findIndex(headers, [
    "Lipídios (g)",
    "Lipidios (g)",
    "Lipídios",
    "Lipidios",
    "Gordura",
  ]);
  const idxTipo = findIndex(headers, ["Tipo"]);

  if (
    [idxAlimento, idxKcal, idxCarbo, idxProteina, idxLipidio, idxTipo].some(
      (idx) => idx < 0
    )
  ) {
    throw new Error(
      "O CSV precisa conter as colunas de alimento, energia, carboidratos, proteína, lipídios e tipo."
    );
  }

  const maxIndex = Math.max(
    idxGrupo,
    idxAlimento,
    idxDescricao,
    idxKcal,
    idxCarbo,
    idxProteina,
    idxLipidio,
    idxTipo
  );

  const data = dataRows
    .filter((row) => row.length >= maxIndex + 1)
    .map((row) => {
      const tipo = row[idxTipo];

      return {
        grupo: idxGrupo >= 0 ? normalizeText(row[idxGrupo]) : "",
        alimento: normalizeText(row[idxAlimento]),
        descricao: idxDescricao >= 0 ? normalizeText(row[idxDescricao]) : "",
        kcal: toNumber(row[idxKcal]),
        carbo: toNumber(row[idxCarbo]),
        proteina: toNumber(row[idxProteina]),
        gordura: toNumber(row[idxLipidio]),
        tipo: normalizeText(tipo),
        base: inferBaseAmount(tipo),
        unidade: inferUnit(tipo),
      };
    })
    .filter((item) => item.alimento && item.kcal > 0);

  if (!data.length) {
    throw new Error("Nenhum item válido foi encontrado no CSV.");
  }

  return data;
}

export function calculate(base, item) {
  if (base.unidade !== item.unidade) {
    throw new Error(
      `Unidades incompatíveis entre ${base.alimento} (${base.unidade}) e ${item.alimento} (${item.unidade}).`
    );
  }

  const kcalBasePorUnidade = base.kcal / base.base;
  const kcalItemPorUnidade = item.kcal / item.base;

  if (!kcalItemPorUnidade) {
    throw new Error(`O item ${item.alimento} possui kcal inválida.`);
  }

  const carboItemPorUnidade = item.carbo / item.base;
  const proteinaItemPorUnidade = item.proteina / item.base;
  const gorduraItemPorUnidade = item.gordura / item.base;

  const kcalAlvo = kcalBasePorUnidade * base.base;
  const quantidadeCrua = kcalAlvo / kcalItemPorUnidade;

  const step = getStep(item.unidade, quantidadeCrua);
  const quantidade = Math.max(step, roundToStep(quantidadeCrua, step));

  return {
    alimento: item.alimento,
    quantidade,
    unidade: item.unidade,
    kcal: +(kcalItemPorUnidade * quantidade).toFixed(2),
    carbo: +(carboItemPorUnidade * quantidade).toFixed(2),
    proteina: +(proteinaItemPorUnidade * quantidade).toFixed(2),
    gordura: +(gorduraItemPorUnidade * quantidade).toFixed(2),
  };
}

export function generateCsv(base, items, delimiter = ",") {
  const header = [
    "Alimento",
    "Quantidade Equivalente",
    "Unidade",
    "Kcal Equivalente",
    "Carboidratos Equivalente",
    "Proteína Equivalente",
    "Lipídios Equivalente",
  ];

  const lines = [header.map((value) => escapeCsvValue(value, delimiter)).join(delimiter)];

  items.slice(1).forEach((item) => {
    const result = calculate(base, item);

    lines.push(
      [
        result.alimento,
        result.quantidade,
        result.unidade,
        result.kcal,
        result.carbo,
        result.proteina,
        result.gordura,
      ]
        .map((value) => escapeCsvValue(value, delimiter))
        .join(delimiter)
    );
  });

  return lines.join("\n");
}

export function parseOutputCsv(text) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(text) === "spaces" ? "," : detectDelimiter(text);
  const headers = splitFlexible(lines[0], delimiter);

  return lines.slice(1).map((line) => {
    const cols = splitFlexible(line, delimiter);
    return headers.reduce((acc, header, index) => {
      acc[header] = cols[index] ?? "";
      return acc;
    }, {});
  });
}