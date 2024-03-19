import { CoreAssets } from "@noice-com/assets-core";
import { useContext } from "react";

import { IconButton } from "../IconButton";

import styles from "./Dialog.module.css";
import { DialogContext } from "./DialogProvider";

export function DialogClose() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog.Close can only be used within a Dialog.");
  }

  const { actions } = context;

  return (
    <div className={styles.dialogCloseWrapper}>
      <IconButton
        theme="light"
        icon={CoreAssets.Icons.Close}
        label="Close"
        size="sm"
        onClick={actions.close}
      />
    </div>
  );
}
