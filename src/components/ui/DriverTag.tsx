import { cn } from "@/lib/utils";
import { getDriver } from "@/lib/drivers";
import { getTeam } from "@/lib/teams";

type Props = {
  /** Driver id (see drivers.ts). Renders nothing when unset/unknown. */
  driverId?: string;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Discord-style "server tag" for a driver: the car number (bold italic) on the
 * left, then the driver code — in a small team-coloured pill.
 * e.g.  ⟦ *63* RUS ⟧
 */
export function DriverTag({ driverId, size = "sm", className }: Props) {
  const driver = getDriver(driverId);
  if (!driver) return null;

  const color = getTeam(driver.teamId)?.baseColor ?? "#646464";
  // Darken toward ink so light team colours (e.g. Haas silver) stay readable.
  const ink = `color-mix(in srgb, ${color} 80%, #101418)`;
  const dims = size === "md" ? "gap-1 px-2 py-0.5 text-[12px]" : "gap-1 px-1.5 py-px text-[11px]";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border align-middle leading-none",
        dims,
        className
      )}
      style={{ backgroundColor: `${color}14`, borderColor: `${color}55` }}
      title={`${driver.nameKo} · #${driver.number}`}
    >
      <span className="font-extrabold italic tabular-nums" style={{ color: ink }}>
        {driver.number}
      </span>
      <span className="font-semibold tracking-wide" style={{ color: ink }}>
        {driver.code}
      </span>
    </span>
  );
}
