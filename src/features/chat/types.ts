export type RoomType = "global" | "team";

export type ChatMessage = {
  id: string;
  roomType: RoomType;
  teamId?: string;
  nickname: string;
  teamColor: string;
  text: string;
  timestamp: string;
  /** Author snapshot — profile picture (http(s)/data URL). */
  avatarUrl?: string;
  /** Author snapshot — driver tag (a Driver id, see drivers.ts). */
  driverTag?: string;
};
