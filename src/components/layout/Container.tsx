import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = (props) => {
  const { children } = props;
  return <div className="mx-auto h-full w-full max-w-sm px-4">{children}</div>;
};

export default Container;
