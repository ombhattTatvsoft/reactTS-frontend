import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
  }

const Card : React.FC<CardProps> = ({children, className}) => {
  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-purple-500/30 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
