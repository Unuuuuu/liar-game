import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/adventurer";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { auth, database, firestore } from "~/firebase";
import SubjectRadioGroup from "./SubjectRadioGroup";
import { QuestionData, RoomData } from "./types";
import CopyLinkButton from "./CopyLinkButton";
import { ref, remove, set } from "firebase/database";
import { getRandomInt } from "~/utils";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import clsx from "clsx";

interface WaitingProps {
  roomCode: string;
  roomData: RoomData;
}

const Waiting: React.FC<WaitingProps> = (props) => {
  const { roomCode, roomData } = props;
  const [isStartButtonLoading, setIsStartButtonLoading] = useState(false);

  if (auth.currentUser === null) {
    return null;
  }

  const { uid } = auth.currentUser;
  const { users, creator, subject } = roomData;
  const isCreator = creator.id === uid;

  const handleStartButtonClick = async () => {
    setIsStartButtonLoading(true);
    // TODO: 3명 아래일 때 confirm modal 띄우기
    await remove(ref(database, `rooms/${roomCode}/question`));

    const userIds = Object.keys(roomData.users ?? {});
    const randomUserIdIndex = getRandomInt(userIds.length);
    await Promise.all(
      userIds.map((userId, userIdIndex) => {
        if (userIdIndex === randomUserIdIndex) {
          return set(
            ref(database, `rooms/${roomCode}/users/${userId}/isLiar`),
            true
          );
        }
        return set(
          ref(database, `rooms/${roomCode}/users/${userId}/isLiar`),
          false
        );
      })
    );

    const querySnapshot = await getDocs(collection(firestore, subject));
    const randomQuestionIndex = getRandomInt(querySnapshot.size);
    const question = querySnapshot.docs[
      randomQuestionIndex
    ].data() as QuestionData;

    await set(ref(database, `rooms/${roomCode}/question`), question);
    await set(ref(database, `rooms/${roomCode}/state`), "playing");

    setIsStartButtonLoading(false);
  };

  // TODO: 현재 유저가 room data 에 포함되어 있지 않다면 placeholder 를 보여주는 방식으로 개선한다.
  // if (
  //   (roomData.users !== undefined &&
  //     !Object.keys(roomData.users).includes(auth.currentUser?.uid ?? ""))
  // ) {
  //   return null;
  // }

  return (
    <>
      <div className="scrollbar-hide h-full overflow-y-auto">
        <div className="flex h-12 items-center gap-2 rounded-lg bg-neutral px-4 text-neutral-content shadow">
          <InformationCircleIcon className="h-5 w-5 text-info" />
          <span className="text-sm font-semibold">
            방장이 주제를 고를 수 있습니다.
          </span>
        </div>
        <SubjectRadioGroup
          value={subject}
          roomCode={roomCode}
          isCreator={isCreator}
        />
        <div className="divider">플레이어</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(users ?? {}).map((user) => {
            const svg = createAvatar(style, {
              seed: user.nickname,
              dataUri: true,
            });
            return (
              <div
                key={user.id}
                className="flex flex-col items-center rounded-lg bg-neutral p-4 text-neutral-content shadow"
              >
                <img src={svg} className="h-8 w-8" />
                <span className="w-full truncate text-center text-sm font-semibold">
                  {user.nickname}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3 py-3">
        <CopyLinkButton />
        {isCreator ? (
          <button
            className={clsx(
              "btn-primary no-animation btn grow",
              isStartButtonLoading && "loading"
            )}
            onClick={handleStartButtonClick}
          >
            시작하기
          </button>
        ) : (
          <button
            className="loading btn-primary no-animation btn grow"
            disabled
          >
            방장이 시작하기를 기다리는 중
          </button>
        )}
      </div>
    </>
  );
};

export default Waiting;
