export type CatalogKind = "drones" | "camaras" | "personas";

export type CatalogItem = { id: string; name: string; [key: string]: string | number | boolean | undefined };

export type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  numeric?: boolean;
  optionalOnEdit?: boolean;
  options?: { id: string; label: string }[];
};

type CatalogDef = {
  tab: string;
  addLabel: string;
  editLabel: string;
  rule: string;
  columns: { label: string; value: (item: CatalogItem) => string }[];
  hasActive: boolean;
  fields: FieldDef[];
};

const MODALITY = [
  { id: "optical", label: "Óptica" },
  { id: "thermal", label: "Térmica" },
];

const POSTURE = [
  { id: "standing", label: "De pie" },
  { id: "sitting", label: "Sentado" },
  { id: "lying", label: "Tendido" },
];

const labelOf = (options: { id: string; label: string }[], id: unknown) =>
  options.find((option) => option.id === id)?.label ?? "";

export const CATALOGS: Record<CatalogKind, CatalogDef> = {
  drones: {
    tab: "Drones",
    addLabel: "Nuevo dron",
    editLabel: "Editar dron",
    rule: "La velocidad y la altura máximas deben ser mayores que las mínimas.",
    hasActive: true,
    columns: [
      { label: "Nombre", value: (i) => i.name },
      { label: "Batería (Wh)", value: (i) => `${i.batteryWh}` },
      { label: "Velocidad (m/s)", value: (i) => `${i.vMin} a ${i.vMax}` },
      { label: "Altura (m)", value: (i) => `${i.hMin} a ${i.hMax}` },
    ],
    fields: [
      { key: "name", label: "Nombre", placeholder: "Ej. Mapeo X" },
      { key: "batteryWh", label: "Batería (Wh)", placeholder: "100", numeric: true },
      { key: "vMin", label: "Velocidad mínima (m/s)", placeholder: "3", numeric: true },
      { key: "vMax", label: "Velocidad máxima (m/s)", placeholder: "12", numeric: true },
      { key: "hMin", label: "Altura mínima (m)", placeholder: "15", numeric: true },
      { key: "hMax", label: "Altura máxima (m)", placeholder: "80", numeric: true },
      { key: "vVertical", label: "Velocidad vertical (m/s)", placeholder: "m/s", numeric: true, optionalOnEdit: true },
      { key: "pBaseW", label: "Potencia base (W)", placeholder: "W", numeric: true, optionalOnEdit: true },
      { key: "cDrag", label: "Coef. de arrastre (J·s²/m³)", placeholder: "c_drag", numeric: true, optionalOnEdit: true },
      { key: "cAltitude", label: "Energía por metro de ascenso (J/m)", placeholder: "J/m", numeric: true, optionalOnEdit: true },
    ],
  },
  camaras: {
    tab: "Cámaras",
    addLabel: "Nueva cámara",
    editLabel: "Editar cámara",
    rule: "El FOV debe estar entre 0 y 180 grados.",
    hasActive: true,
    columns: [
      { label: "Nombre", value: (i) => i.name },
      { label: "Modalidad", value: (i) => labelOf(MODALITY, i.modality) },
      { label: "FOV (°)", value: (i) => `${i.fovDeg}` },
      { label: "Píxeles a lo ancho", value: (i) => `${i.widthPx}` },
    ],
    fields: [
      { key: "name", label: "Nombre", placeholder: "Ej. Térmica 1280" },
      { key: "modality", label: "Modalidad", options: MODALITY },
      { key: "fovDeg", label: "FOV (°)", placeholder: "0 a 180", numeric: true },
      { key: "widthPx", label: "Píxeles a lo ancho", placeholder: "4000", numeric: true },
      { key: "powerW", label: "Potencia (W)", placeholder: "W", numeric: true, optionalOnEdit: true },
      { key: "batteryWh", label: "Batería de cámara (Wh)", placeholder: "Wh", numeric: true, optionalOnEdit: true },
      { key: "maxRangeM", label: "Alcance máximo (m)", placeholder: "m", numeric: true, optionalOnEdit: true },
    ],
  },
  personas: {
    tab: "Personas",
    addLabel: "Nueva persona",
    editLabel: "Editar persona",
    rule: "Los píxeles mínimos deben ser 1 o más.",
    hasActive: false,
    columns: [
      { label: "Nombre", value: (i) => i.name },
      { label: "Postura", value: (i) => labelOf(POSTURE, i.posture) },
      { label: "Dimensión crítica (m)", value: (i) => `${i.criticalDimM}` },
      { label: "Mín. px óptica", value: (i) => `${i.pxMinOptical}` },
      { label: "Mín. px térmica", value: (i) => `${i.pxMinThermal}` },
    ],
    fields: [
      { key: "name", label: "Nombre", placeholder: "Ej. Adulto sentado" },
      { key: "posture", label: "Postura", options: POSTURE },
      { key: "criticalDimM", label: "Dimensión crítica (m)", placeholder: "0.5", numeric: true },
      { key: "pxMinOptical", label: "Píxeles mínimos en óptica", placeholder: "20", numeric: true },
      { key: "pxMinThermal", label: "Píxeles mínimos en térmica", placeholder: "8", numeric: true },
    ],
  },
};

export const CATALOG_KINDS = Object.keys(CATALOGS) as CatalogKind[];
