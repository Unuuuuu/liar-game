import { child, get, ref } from "firebase/database";
import { database } from "./firebase";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateRandomRoomCode = () => {
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
};

export const getUniqueRandomRoomCode = async (): Promise<string> => {
  const generatedRandomRoomCode = generateRandomRoomCode();
  const databaseRef = ref(database);
  const dataSnapshot = await get(
    child(databaseRef, `rooms/${generatedRandomRoomCode}`)
  );

  // 생성된 room code 를 database 에 조회했을 때, 이미 존재한다면 다시 생성한다.
  if (dataSnapshot.exists()) {
    return getUniqueRandomRoomCode();
  }

  return generatedRandomRoomCode;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
