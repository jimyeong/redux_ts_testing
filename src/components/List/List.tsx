import React, { ReactElement } from "react";

interface IList<T> {
  data: T[];
  render(): JSX.Element;
}

const List = <T,>({ data, render }: IList<T>): JSX.Element => {
  return <div>{data.map(render)}</div>;
};

export default List;
