import React, { PropsWithChildren } from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import Header from "./Header";
import FAV from '../../../public/favicon.ico'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const layoutStyles = {
    background: 'red',
    padding: "20px",
    minHeight: "100vh",
  };

  const titleStyles = {
    color: "#333",
    fontWeight: "4000",
  };

  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => (
        <ThemedTitleV2
          {...titleProps}
          text="KANBAN BOARD"
          icon={<img src={FAV} alt="Logo" style={{ width: 24 }} />}
          style={titleStyles as React.CSSProperties} // Type cast if necessary
        />
      )}
      style={layoutStyles as React.CSSProperties} // Type cast if necessary
    >
      {children}
    </ThemedLayoutV2>
  );
};

export default Layout;
