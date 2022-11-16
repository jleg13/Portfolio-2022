import "../styles/Heading.css";

interface HeadingProps {
  heading: string;
  subheading: string;
}

export default function Heading({heading, subheading}: HeadingProps) {
  return (
    <div className="heading">
      <div className="overflow-hidden seperator">
        <h1 className="heading__title slide-up">{heading}</h1>
      </div>
      <div className="overflow-hidden">
        <h2 className="heading__subtitle drop-in">{subheading}</h2>
      </div>
    </div>
  );
}
