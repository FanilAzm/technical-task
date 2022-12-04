import * as React from "react";
import styles from "./Layout.module.scss";

type ILayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<ILayoutProps> = ({children}) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Layout;
