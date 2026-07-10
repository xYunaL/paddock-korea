import { cn } from "@/lib/utils";
import { getDriver, FAN_TAG } from "@/lib/drivers";
import { getTeam } from "@/lib/teams";

type Props = {
  /** Driver id or the all-fan tag (FAN_TAG). Renders nothing when unset/unknown. */
  driverId?: string;
  size?: "sm" | "md";
  /** Render for a dark background (light text + coloured border). */
  onDark?: boolean;
  className?: string;
};

const FAN_GOLD = "#d98a00";

/**
 * Discord-style "server tag": car number (bold italic) + driver code in a small
 * team-coloured pill. The special FAN_TAG renders "F1 FAN" for all-fans.
 */
export function DriverTag({ driverId, size = "sm", onDark = false, className }: Props) {
  if (!driverId) return null;

  const dims =
    size === "md" ? "gap-1 px-2 py-0.5 text-[12px]" : "gap-1 px-1.5 py-px text-[11px]";
  const base =
    "inline-flex shrink-0 items-center rounded-md border align-middle leading-none";

  // F1 FAN (all-fan) tag.
  if (driverId === FAN_TAG) {
    return (
      <span
        className={cn(base, dims, className)}
        style={
          onDark
            ? { backgroundColor: "rgba(255,255,255,0.1)", borderColor: FAN_GOLD, color: "#f4d58a" }
            : { backgroundColor: `${FAN_GOLD}14`, borderColor: `${FAN_GOLD}55`, color: FAN_GOLD }
        }
        title="F1 팬"
      >
        <span className="font-extrabold italic">F1</span>
        <span className="font-semibold tracking-wide">FAN</span>
      </span>
    );
  }

  const driver = getDriver(driverId);
  if (!driver) return null;

  const color = getTeam(driver.teamId)?.baseColor ?? "#646464";
  // On light: darken toward ink so pale team colours stay readable.
  const ink = `color-mix(in srgb, ${color} 80%, #101418)`;
  const textStyle = onDark ? undefined : { color: ink };

  return (
    <span
      className={cn(base, dims, className)}
      style={
        onDark
          ? { backgroundColor: "rgba(255,255,255,0.1)", borderColor: color, color: "#ffffff" }
          : { backgroundColor: `${color}14`, borderColor: `${color}55` }
      }
      title={`${driver.nameKo} · #${driver.number}`}
    >
      <span className="font-extrabold italic tabular-nums" style={textStyle}>
        {driver.number}
      </span>
      <span className="font-semibold tracking-wide" style={textStyle}>
        {driver.code}
      </span>
    </span>
  );
}
