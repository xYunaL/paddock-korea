export type RoomType = "global" | "team";

export type ChatMessage = {
  id: string;
  roomType: RoomType;
  teamId?: string;
  nickname: string;
  teamColor: string;
  text: string;
  timestamp: string;
};
