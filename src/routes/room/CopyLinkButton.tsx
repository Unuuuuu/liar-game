import React, { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useTimeoutFn } from "react-use";
import clsx from "clsx";

const CopyLinkButton = () => {
  const [isCopying, setIsCopying] = useState(false);
  const [, , reset] = useTimeoutFn(() => setIsCopying(false), 1000);

  const url = new URL(window.location.href).toString();

  const handleCopyLinkButtonClick = () => {
    if (isCopying) {
      return;
    }

    setIsCopying(true);
    navigator.clipboard.writeText(url);
    reset();
  };

  return (
    <button
      className="no-animation btn-square btn"
      onClick={handleCopyLinkButtonClick}
    >
      <label className={clsx("swap", isCopying && "swap-active")}>
        <ClipboardIcon className="swap-off h-5 w-5" />
        <CheckIcon className="swap-on h-5 w-5 text-success" />
      </label>
    </button>
  );
};

export default CopyLinkButton;
