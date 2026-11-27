import { Card } from "@/shared/components/Card";
import { ROWS, type ProfileId } from "../data/comparison";

export function ComparisonTable({ selected }: { selected: ProfileId }) {
  return (
    <Card className="overflow-x-auto px-3.5 py-1.5">
      <table className="w-full text-left text-xs">
        <thead className="text-ra-mut">
          <tr>
            {["Método", "R_de %", "Tiempo min", "Energía Wh"].map((t) => <th key={t} className="py-1.5 font-medium">{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const active = row.kind === "ga" && row.profile === selected;
            const color = active ? "font-medium text-ra-acc" : row.kind === "grid" ? "text-ra-yellow" : row.kind === "random" ? "text-ra-mut" : "";
            return (
              <tr key={row.id} className={color}>
                <td className="py-1.5">{row.label}</td>
                <td className="font-mono">{row.rde.toFixed(1)}</td>
                <td className="font-mono">{row.time.toFixed(1)}</td>
                <td className="font-mono">{row.energy.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
