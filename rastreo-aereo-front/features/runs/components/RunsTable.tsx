"use client";

import { Spinner } from "@heroui/react";
import { Activity, ChartColumn, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/shared/components/Card";
import { isFinished, progressOf, STATUS_COLOR, STATUS_LABEL } from "../services/run.rules";
import type { Run } from "../services/run.types";

type Props = { runs: Run[]; deletingId?: string; onDelete: (id: string) => void };

const LINK = "flex items-center gap-1";

export function RunsTable({ runs, deletingId, onDelete }: Props) {
  return (
    <Card className="overflow-x-auto px-[18px] py-1.5">
      <table className="w-full min-w-[760px] text-left text-[13px]">
        <thead className="text-ra-mut">
          <tr>
            {["Corrida", "Escenario", "Estado", "Progreso", "Generaciones", "Acciones"].map((title) => (
              <th key={title} className="py-3 font-medium">{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td className="py-3">#{run.id}</td>
              <td className="py-3">{run.scenarioName}</td>
              <td className={`py-3 ${STATUS_COLOR[run.status]}`}>{STATUS_LABEL[run.status]}</td>
              <td className="py-3">{run.status === "running" || run.status === "completed" ? `${progressOf(run)} %` : "—"}</td>
              <td className="py-3">{run.generation} / {run.generations}</td>
              <td className="py-3">
                <div className="flex gap-3 text-xs font-medium text-ra-blue">
                  {run.status === "running" ? <Link className={LINK} href={`/corridas/${run.id}`}><Activity className="size-3" /> Ver avance</Link> : null}
                  {run.status === "completed" ? <Link className={LINK} href={`/corridas/${run.id}/resultados`}><ChartColumn className="size-3" /> Ver resultados</Link> : null}
                  {run.status === "failed" ? <Link className={LINK} href={`/corridas/${run.id}`}><Activity className="size-3" /> Ver error</Link> : null}
                  {isFinished(run) ? (
                    <button type="button" disabled={deletingId === run.id} onClick={() => onDelete(run.id)} className={`${LINK} cursor-pointer`}>
                      {deletingId === run.id ? <Spinner size="sm" color="current" /> : <Trash2 className="size-3" />} Eliminar
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
