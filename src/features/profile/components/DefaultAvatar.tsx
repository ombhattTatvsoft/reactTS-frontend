import { useCallback } from "react";

interface DefaultAvatarProps{
    name : string;
    className? : string;
}

const DefaultAvatar = ({name, className} : DefaultAvatarProps) => {
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);
  return (
    <div className={`bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white border-4 border-purple-200 shadow-lg ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default DefaultAvatar;
