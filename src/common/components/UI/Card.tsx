import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
  }

const Card : React.FC<CardProps> = ({children, className}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-purple-500/30 ${className}`}>
        <div className="p-6">
            {children}
        </div>
    </div>
  );
};

export default Card;
