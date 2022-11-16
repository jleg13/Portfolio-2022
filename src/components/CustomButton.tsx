import { CSSTransition } from "react-transition-group";
import { Button } from "semantic-ui-react";
import "../styles/CustomButton.css";

interface CustomButtonProps {
  onClick: () => void;
  icon: string;
  size:
    | "mini"
    | "tiny"
    | "small"
    | "medium"
    | "large"
    | "big"
    | "huge"
    | "massive";
  style: { [key: string]: string };
}

export default function CustomButton({
  onClick,
  icon,
  size,
  style,
}: CustomButtonProps) {
  return (
    <CSSTransition
      classNames={`${icon}-button-transition`}
      in={true}
      appear
      timeout={800}
    >
      <div className={`${icon}-button`}>
        <Button icon={icon} size={size} style={style} onClick={onClick} />
      </div>
    </CSSTransition>
  );
}
