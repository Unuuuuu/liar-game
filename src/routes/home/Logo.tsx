import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      <img src="/joker.svg" className="h-32 w-32" alt="joker" />
      <h1 className="text-4xl font-semibold">라이어 게임</h1>
    </div>
  );
};

export default Logo;
