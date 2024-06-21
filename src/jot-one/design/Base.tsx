import React from "react";

export interface BaseButtonProps extends BaseProps {
  onClick?: () => void;
}

export interface BaseProps extends React.PropsWithChildren {
  className?: string;
}
