import React, { ReactNode } from "react";

interface GlobalContainer {
  children: ReactNode;
}

const GlobalContainer = ({ children }: GlobalContainer) => {
  return <div className="ly__container global__container">{children}</div>;
};

export default GlobalContainer;
