import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import React, { ChangeEventHandler, useEffect } from "react";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth, database } from "~/firebase";
import { getUniqueRandomRoomCode } from "~/utils";

interface FieldValues {
  nickname: string;
}

interface CreateRoomTabPanelProps {
  nickname: string;
  updateNickname: (value: string) => void;
}

const CreateRoomTabPanel: React.FC<CreateRoomTabPanelProps> = (props) => {
  const { nickname, updateNickname } = props;
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const { field: nicknameField } = useController<FieldValues>({
    name: "nickname",
    control,
    rules: {
      required: "닉네임은 필수입니다.",
    },
  });

  useEffect(() => {
    nicknameField.onChange({ target: { value: nickname } });
  }, [nickname, nicknameField]);

  const onSubmit: SubmitHandler<FieldValues> = async (fieldValues) => {
    const { nickname } = fieldValues;
    if (auth.currentUser === null) {
      // sign in 되어있지 않은 경우에 sign in 한다.
      const { user } = await signInAnonymously(auth);
      await updateProfile(user, {
        displayName: nickname,
      });
    } else if (auth.currentUser.displayName !== nickname) {
      // sign in 은 되어있는데, nickname 이 변경된 경우에 profile 을 update 한다.
      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });
    }

    if (auth.currentUser === null) {
      return;
    }

    const { uid, displayName } = auth.currentUser;
    const creator = {
      id: uid,
      nickname: displayName,
      isLiar: false,
    };
    const roomCode = await getUniqueRandomRoomCode();

    await set(ref(database, "rooms/" + roomCode), {
      state: "waiting",
      subject: "영화",
      creator,
      users: {
        [uid]: creator,
      },
    });

    navigate(`rooms/${roomCode}`);
  };

  const handleNicknameInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    updateNickname(event.target.value);
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
      </form>
      <button
        form="form"
        className={clsx(
          "btn-primary no-animation btn w-full",
          isSubmitting && "loading"
        )}
      >
        만들기
      </button>
    </Tab.Panel>
  );
};

export default CreateRoomTabPanel;
