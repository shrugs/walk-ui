import { inject, observer } from "mobx-react";
import { compose } from "recompose";

export const withStore = (...args) => {
  return compose(
    inject(...args),
    observer
  );
};
