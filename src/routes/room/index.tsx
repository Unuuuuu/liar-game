import {
  get,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useAppSelector } from "~/app/hooks";
import Container from "~/components/Container";
import { auth, database } from "~/firebase";
import { updateRoomCode } from "~/slices/roomSlice";
import { RoomData } from "./types";
import Waiting from "./Waiting";
import Playing from "./Playing";

export const loader: LoaderFunction = async ({ params }) => {
  const { roomCode } = params;
  if (roomCode === undefined) {
    return null;
  }

  const dataSnapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!dataSnapshot.exists()) {
    return null;
  }

  return {
    roomCode,
    initialRoomData: dataSnapshot.val(),
  };
};

// 음식, 동물, 영화, 인물, 직업, 장소

/**
 * TODO:
 * - user list
 * - leave room
 * - start game (greater than 3 person)
 * - select category (room manager)
 * - pass 기능
 * - user 옆에 up / down 투표 기능
 * - 글자 수 힌트 기능
 * - 강퇴 기능
 * - license cc 4.0
 */

const Room = () => {
  const loaderData = useLoaderData() as {
    roomCode: string;
    initialRoomData: RoomData;
  } | null;
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<RoomData | null>(
    loaderData?.initialRoomData ?? null
  );
  const isInitialAuthLoadingCompleted = useAppSelector(
    (state) => state.auth.isInitialAuthLoadingCompleted
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaderData === null) {
      // TODO: display error message
      navigate("/");
    }
  });

  useEffect(() => {
    if (!isInitialAuthLoadingCompleted || loaderData === null) {
      return;
    }

    const { roomCode } = loaderData;
    dispatch(updateRoomCode(roomCode));

    // auth loading 이 완료되었는데 sign in 상태가 아니라면 home page 로 튕긴다.
    if (auth.currentUser === null) {
      navigate("/");
      return;
    }

    const { uid, displayName } = auth.currentUser;
    const user = {
      id: uid,
      nickname: displayName,
      isLiar: false,
    };

    const userRef = ref(database, `rooms/${roomCode}/users/${uid}`);
    set(userRef, user);
    // TODO: onDisconnect 개선
    onDisconnect(userRef).remove();

    // TODO: creator 인 경우에 onDisconnect 하면 remove room

    const unsubscribe = onValue(
      ref(database, `rooms/${roomCode}`),
      async (snapshot) => {
        const value = snapshot.val();
        if (value === null) {
          // TODO: display error message
          navigate("/");
          return;
        }

        if (value.users === undefined) {
          await remove(ref(database, `rooms/${roomCode}`));
          return;
        }

        setRoomData(value);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, isInitialAuthLoadingCompleted, loaderData, navigate]);

  if (loaderData === null || roomData === null || auth.currentUser === null) {
    return null;
  }

  const { roomCode } = loaderData;

  const { state, creator } = roomData;
  const { uid } = auth.currentUser;
  const isCreator = creator.id === uid;

  const handleLeaveRoomButtonClick = () => {
    // TODO: confirm modal 띄우기
    remove(ref(database, `rooms/${roomCode}/users/${uid}`));
    if (isCreator) {
      remove(ref(database, `rooms/${roomCode}`));
    }
  };

  return (
    <Container>
      <div className="flex h-full flex-col">
        <div className="flex justify-between py-3">
          <img src="/joker.svg" className="h-8 w-8" alt="joker" />
          <Link to="/">
            <button
              className="no-animation btn-sm btn"
              onClick={handleLeaveRoomButtonClick}
            >
              방 나가기
            </button>
          </Link>
        </div>
        {state === "waiting" && (
          <Waiting roomCode={roomCode} roomData={roomData} />
        )}
        {(state === "playing" || state === "restarting") && (
          <Playing roomCode={roomCode} roomData={roomData} />
        )}
      </div>
    </Container>
  );
};

export default Room;
