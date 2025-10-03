import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
  }

const Card : React.FC<CardProps> = ({children}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-purple-500/30">
        <div className="p-6">
            {children}
        </div>
    </div>
  );
};

export default Card;
