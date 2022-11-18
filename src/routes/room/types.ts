export interface UserData {
  id: string;
  nickname: string;
  isLiar: boolean;
}

export type Subject = "영화" | "음식" | "동물 (준비 중)" | "인물 (준비 중)";

export interface QuestionData {
  name: string;
  description: string;
  image: string;
}

export interface RoomData {
  creator: {
    id: string;
    name: string;
  };
  state: "waiting" | "playing" | "restarting";
  subject: Subject;
  users?: {
    [index: string]: UserData;
  };
  question?: QuestionData;
}
