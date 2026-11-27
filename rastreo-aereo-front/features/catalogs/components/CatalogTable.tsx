"use client";

import { Spinner } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/shared/components/Card";
import { CATALOGS, type CatalogItem, type CatalogKind } from "../config/catalogs";

type Props = {
  kind: CatalogKind;
  items: CatalogItem[];
  deletingId?: string;
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: string) => void;
};

export function CatalogTable({ kind, items, deletingId, onEdit, onDelete }: Props) {
  const { columns, hasActive } = CATALOGS[kind];
  return (
    <Card className="overflow-x-auto px-[18px] py-1.5">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="text-ra-mut">
          <tr>
            {columns.map((column) => <th key={column.label} className="py-3 font-medium">{column.label}</th>)}
            {hasActive ? <th className="py-3 font-medium">Activo</th> : null}
            <th className="w-[160px] py-3 text-xs font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((column, i) => (
                <td key={column.label} className={`py-3 ${i === 0 ? "font-medium" : "font-mono"}`}>{column.value(item)}</td>
              ))}
              {hasActive ? <td className={`py-3 ${item.active ? "text-ra-teal" : "text-ra-mut"}`}>{item.active ? "Sí" : "○ No"}</td> : null}
              <td className="py-3">
                <div className="flex gap-3 text-xs font-medium text-ra-blue">
                  <button type="button" onClick={() => onEdit(item)} className="flex cursor-pointer items-center gap-1">
                    <Pencil className="size-3" />
                  </button>
                  <button type="button" disabled={deletingId === item.id} onClick={() => onDelete(item.id)} className="flex cursor-pointer items-center gap-1">
                    {deletingId === item.id ? <Spinner size="sm" color="current" /> : <Trash2 className="size-3" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
