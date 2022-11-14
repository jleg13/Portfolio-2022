import { useState } from "react";
import { List, Button } from "semantic-ui-react";
import { KeyDataList } from "../types";
import { CSSTransition } from "react-transition-group";
import "../styles/SlideOutList.css";

export default function SlideOutList({ data }: { data: KeyDataList }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="slide-out-list">
      <div className="slide-out-list__data">
        <CSSTransition
          in={showKey}
          timeout={400}
          classNames="key"
          unmountOnExit
        >
          <List horizontal>
            {data.map((item, index) => {
              return (
                <List.Item key={index}>
                  <List.Icon name="circle" style={{ color: item.color }} />
                  <List.Content>{item.label}</List.Content>
                </List.Item>
              );
            })}
          </List>
        </CSSTransition>
      </div>
      <div className="slide-out-list__button">
        <Button
          icon={showKey ? "angle double right" : "angle double left"}
          size="huge"
          style={{ backgroundColor: "#686a63" }}
          onClick={() => setShowKey(!showKey)}
        />
      </div>
    </div>
  );
}
