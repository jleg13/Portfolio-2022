import React from "react";
import { SemanticICONS, Icon } from "semantic-ui-react";
import "../styles/SocialList.css";
import { CSSTransition } from "react-transition-group";

interface SocialListProps {
  data: {
    icon: SemanticICONS;
    url: string;
  }[];
}

export default function SocialList({ data }: SocialListProps) {
  return (
    <CSSTransition
      classNames={"social-list-transition"}
      in={true}
      appear={true}
      timeout={800}
    >
    <div className="social-list">
          {data.map((item, index) => {
            return (
              <div className="social-list__item" key={index}>
                <a href={item.url} target="_blank" rel="noreferrer">
                <Icon 
                name={item.icon} 
                size="big"
                style={{ color: "#686a63" }}
                />
                </a>
              </div>
            );
          })}
    </div>
    </CSSTransition>
  );
}
           