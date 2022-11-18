import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { ChangeEventHandler, useEffect } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "~/app/hooks";
import { auth, database } from "~/firebase";
import { updateRoomCode } from "~/slices/roomSlice";

interface FieldValues {
  nickname: string;
  roomCode: string;
}

interface JoinRoomTabPanelProps {
  nickname: string;
  updateNickname: (value: string) => void;
}

const JoinRoomTabPanel: React.FC<JoinRoomTabPanelProps> = (props) => {
  const { nickname, updateNickname } = props;
  const roomCode = useAppSelector((state) => state.room.roomCode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const { field: nicknameField } = useController<FieldValues>({
    name: "nickname",
    control,
    rules: {
      required: "닉네임은 필수입니다.",
    },
  });
  const { field: roomCodeField } = useController<FieldValues>({
    name: "roomCode",
    control,
    rules: {
      required: "방 코드는 필수입니다.",
    },
  });

  useEffect(() => {
    nicknameField.onChange({ target: { value: nickname } });
  }, [nickname, nicknameField]);

  useEffect(() => {
    roomCodeField.onChange({ target: { value: roomCode } });
  }, [roomCode, roomCodeField]);

  const onSubmit: SubmitHandler<FieldValues> = async (fieldValues) => {
    const { nickname, roomCode } = fieldValues;
    if (auth.currentUser === null) {
      // sign in 되어있지 않은 경우에 sign in 한다.
      const { user } = await signInAnonymously(auth);
      await updateProfile(user, {
        displayName: nickname,
      });
    } else if (auth.currentUser.displayName !== nickname) {
      // sign in 은 되어있는데, name 이 변경된 경우에 profile 을 update 한다.
      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });
    }

    if (auth.currentUser === null) {
      return;
    }

    const roomRef = ref(database, `rooms/${roomCode}`);
    const dataSnapshot = await get(roomRef);

    // room code 를 database 에 조회했을 때, 존재하지 않으면 error message 를 띄운다.
    if (!dataSnapshot.exists()) {
      // TODO: display error message
      return;
    }

    navigate(`rooms/${roomCode}`);
  };

  const handleNicknameInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    updateNickname(event.target.value);
  };
  const handleRoomCodeInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    dispatch(updateRoomCode(value));
  };

  return (
    <Tab.Panel>
      <form
        id="form"
        className="mb-4 flex flex-col gap-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">닉네임</span>
          </label>
          <input
            type="text"
            className="input-bordered input w-full focus:outline-none"
            {...nicknameField}
            onChange={handleNicknameInputChange}
            value={nickname}
          />
          {errors.nickname && (
            <label className="label mt-1 py-0">
              <span className="label-text text-xs text-error">
                {errors.nickname.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">방 코드</span>
          </label>
          <input
            type="text"
            className="input-bordered input w-full placeholder-base-content/20 focus:outline-none"
            placeholder="ABCD"
            maxLength={4}
            {...roomCodeField}
            onChange={handleRoomCodeInputChange}
            value={roomCode}
          />
          {errors.roomCode && (
            <label className="label mt-1 py-0">
              <span className="label-text text-xs text-error">
                {errors.roomCode.message}
              </span>
            </label>
          )}
        </div>
      </form>
      <button
        form="form"
        className={clsx(
          "btn-primary no-animation btn w-full",
          isSubmitting && "loading"
        )}
      >
        참여하기
      </button>
    </Tab.Panel>
  );
};

export default JoinRoomTabPanel;
