import { formatKstTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import type { ChatMessage } from "./types";

type Props = {
  message: ChatMessage;
  isOwn: boolean;
};

/**
 * Single chat message bubble (FR-004).
 * Own messages: right-aligned, team-color tint. Others: left-aligned, charcoal.
 */
export function ChatBubble({ message, isOwn }: Props) {
  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div className="flex items-center gap-1.5 px-1">
        <Avatar src={message.avatarUrl} name={message.nickname} size={20} />
        <span className="text-[13px] font-semibold" style={{ color: message.teamColor }}>
          {message.nickname}
        </span>
        <DriverTag driverId={message.driverTag} />
      </div>
      <div
        className={cn(
          "mt-1 flex max-w-[85%] items-end gap-1.5",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "min-w-0 break-words rounded-xl px-3.5 py-2 text-sm leading-relaxed",
            isOwn
              ? "rounded-tr-sm text-[var(--text)]"
              : "rounded-tl-sm bg-[var(--bubble-other)] text-[var(--text-muted)]"
          )}
          style={
            isOwn
              ? { backgroundColor: `${message.teamColor}26` /* ~15% alpha */ }
              : undefined
          }
        >
          {message.text}
        </div>
        <span className="shrink-0 pb-0.5 text-[11px] text-[var(--text-faint)]">
          {formatKstTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
