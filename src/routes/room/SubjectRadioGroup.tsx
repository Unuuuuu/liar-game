import { RadioGroup, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ref, set } from "firebase/database";
import React, { Fragment } from "react";
import { database } from "~/firebase";
import { Subject } from "./types";

const subjectRadioGroupOptions: {
  id: number;
  name: Subject;
  disabled: boolean;
}[] = [
  { id: 1, name: "영화", disabled: false },
  { id: 2, name: "음식", disabled: false },
  { id: 3, name: "동물 (준비 중)", disabled: true },
  { id: 4, name: "인물 (준비 중)", disabled: true },
];

interface SubjectRadioGroupProps {
  roomCode: string;
  value: Subject;
  isCreator: boolean;
}

const SubjectRadioGroup: React.FC<SubjectRadioGroupProps> = (props) => {
  const { roomCode, value, isCreator } = props;

  const handleChange = (value: Subject) => {
    if (!isCreator) {
      return;
    }
    set(ref(database, `rooms/${roomCode}/subject`), value);
  };

  return (
    <RadioGroup<"div", Subject> value={value} onChange={handleChange}>
      <RadioGroup.Label className="divider">주제</RadioGroup.Label>
      <div className="grid grid-cols-2 gap-3">
        {subjectRadioGroupOptions.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option.name}
            disabled={option.disabled}
          >
            {({ checked }) => (
              <button
                className="no-animation btn w-full justify-between shadow"
                disabled={option.disabled}
              >
                <span>{option.name}</span>
                <Transition
                  as={Fragment}
                  show={checked}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                </Transition>
              </button>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default SubjectRadioGroup;
