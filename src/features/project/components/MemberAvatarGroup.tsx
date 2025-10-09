import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { memo } from "react";

interface MemberAvatarGroupProps {
  title: string;
  members: { key: string; label: string; initials: string }[];
}

const MemberAvatarGroup: React.FC<MemberAvatarGroupProps> = memo(
  ({ title, members }) => {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
        <AvatarGroup max={6}>
          {members.map((member) => (
            <Tooltip key={member.key} title={member.label} arrow>
              <Avatar
                sx={{
                  background: "linear-gradient(to right, #6366F1, #8B5CF6)",
                  fontSize: 14,
                  height: 36,
                  width: 36,
                }}
              >
                {member.initials}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </div>
    );
  }
);

export default MemberAvatarGroup;
