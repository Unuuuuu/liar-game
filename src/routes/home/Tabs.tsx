import { Tab } from "@headlessui/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "~/app/hooks";
import { auth } from "~/firebase";
import CreateRoomTabPanel from "./CreateRoomTabPanel";
import JoinRoomTabPanel from "./JoinRoomTabPanel";

const Tabs = () => {
  const [nickname, setNickname] = useState("");
  const isInitialAuthLoadingCompleted = useAppSelector(
    (state) => state.auth.isInitialAuthLoadingCompleted
  );

  const updateNickname = (value: string) => {
    setNickname(value);
  };

  useEffect(() => {
    if (isInitialAuthLoadingCompleted && auth.currentUser !== null) {
      setNickname(auth.currentUser.displayName ?? "");
    }
  }, [isInitialAuthLoadingCompleted]);

  return (
    <Tab.Group as="div">
      <Tab.List className="tabs tabs-boxed">
        {["방 참여하기", "방 만들기"].map((value) => (
          <Tab
            key={value}
            className={({ selected }) =>
              clsx(
                "tab grow basis-0 focus:outline-none",
                selected && "tab-active"
              )
            }
          >
            {value}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="w-full">
        <JoinRoomTabPanel nickname={nickname} updateNickname={updateNickname} />
        <CreateRoomTabPanel
          nickname={nickname}
          updateNickname={updateNickname}
        />
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;
