import React from "react";
import { auth, database, firestore } from "~/firebase";
import { QuestionData, RoomData } from "./types";
import LiarSvg from "~/assets/Liar.svg";
import NotLiarSvg from "~/assets/NotLiar.svg";
import { getRandomInt } from "~/utils";
import { ref, remove, set } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import clsx from "clsx";

interface PlayingProps {
  roomCode: string;
  roomData: RoomData;
}

const Playing: React.FC<PlayingProps> = (props) => {
  const { roomCode, roomData } = props;
  const { users, subject, creator, question, state } = roomData;
  const usersCount = Object.keys(users ?? {}).length;

  if (auth.currentUser === null || usersCount === 0) {
    return null;
  }

  const { uid } = auth.currentUser;
  const userData = users?.[uid];
  const isLiar = userData?.isLiar ?? false;
  const isCreator = creator.id === uid;

  const handleChangeSubjectButtonClick = () => {
    set(ref(database, `rooms/${roomCode}/state`), "waiting");
  };

  const handleRestartButtonClick = async () => {
    await set(ref(database, `rooms/${roomCode}/state`), "restarting");
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
    console.log(querySnapshot.size, querySnapshot.docs.length);
    const randomQuestionIndex = getRandomInt(querySnapshot.size);
    const question = querySnapshot.docs[
      randomQuestionIndex
    ].data() as QuestionData;

    await set(ref(database, `rooms/${roomCode}/question`), question);
    await set(ref(database, `rooms/${roomCode}/state`), "playing");
  };

  return (
    <>
      <div className="scrollbar-hide h-full overflow-y-auto">
        {state === "restarting" ? (
          <div className="h-[48px] animate-pulse rounded-lg bg-base-200" />
        ) : isLiar ? (
          <div className="flex h-12 items-center gap-2 rounded-lg bg-error px-4 text-error-content shadow">
            <img src={LiarSvg} alt="liar" className="h-5 w-5" />
            <span className="text-sm font-semibold">당신은 라이어입니다.</span>
          </div>
        ) : (
          <div className="flex h-12 items-center gap-2 rounded-lg bg-success px-4 text-success-content shadow">
            <img src={NotLiarSvg} alt="not-liar" className="h-5 w-5" />
            <span className="text-sm font-semibold">
              당신은 라이어가 아닙니다.
            </span>
          </div>
        )}
        <div className="divider">문제</div>
        {state === "restarting" || question === undefined ? (
          <div className="h-[148px] animate-pulse rounded-lg bg-base-200" />
        ) : (
          <div className="overflow-hidden rounded-lg bg-neutral text-neutral-content shadow">
            {!isLiar && (
              <img
                src={question.image}
                alt={question.name}
                className="w-full"
              />
            )}
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-col">
                <span className="opacity-60">주제</span>
                <span className="text-xl font-extrabold">{subject}</span>
              </div>
              <div className="flex flex-col">
                <span className="opacity-60">제시어</span>
                <span className="break-keep text-xl font-extrabold">
                  {isLiar ? "제시어를 맞춰보세요." : question.name}
                </span>
                {!isLiar && question.description !== undefined && (
                  <span className="mt-1 break-keep text-sm">
                    {question.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3 py-3">
        <button
          className="no-animation btn flex-1"
          onClick={handleChangeSubjectButtonClick}
          disabled={!isCreator}
        >
          주제 변경하기
        </button>
        <button
          className={clsx(
            "btn-primary no-animation btn flex-1",
            state === "restarting" && "loading"
          )}
          onClick={handleRestartButtonClick}
          disabled={!isCreator}
        >
          새 게임 시작하기
        </button>
      </div>
    </>
  );
};

export default Playing;
