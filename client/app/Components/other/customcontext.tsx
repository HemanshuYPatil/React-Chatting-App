import React from "react";
import styles from "./contex.module.css";
import { xMark } from "@/utils/Icons";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  closechat: () => void
  key: number;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, closechat, key }) => {
  return (
    <div className={styles.contextMenu} style={{ top: y, left: x }} key={key}>
      <div className={styles.option} onClick={closechat}>
        <span className="mr-3 text-[#454e56] dark:text-white/65">{xMark }</span>
        Close chat
      </div>
      
    </div>
  );
};

export default ContextMenu;
