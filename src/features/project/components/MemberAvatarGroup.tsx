import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { memo } from "react";
import { backendUrl } from "../../../common/api/baseApi";

interface MemberAvatarGroupProps {
  title: string;
  members: {
    key: string;
    label: string;
    avatar: string | undefined;
    alternateAvatar: string;
  }[];
}

const MemberAvatarGroup: React.FC<MemberAvatarGroupProps> = memo(
  ({ title, members }) => {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
        <AvatarGroup max={6}>
          {members.map((member) => {
            const hasImage = Boolean(member.avatar);
            const showInitials = !hasImage;

            return (
              <Tooltip key={member.key} title={member.label} arrow>
                <Avatar
                  src={hasImage ? `${backendUrl}${member.avatar}` : undefined}
                  sx={{
                    background: showInitials
                      ? "linear-gradient(to bottom right, #7c3aed, #2563eb)"
                      : undefined,
                    color: showInitials ? "#fff" : undefined,
                    border: "4px solid #E9D5FF",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    fontWeight: 600,
                    fontSize: 14,
                    height: 36,
                    width: 36,
                    textTransform: "uppercase",
                  }}
                >
                  {showInitials &&
                    member.alternateAvatar
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                </Avatar>
              </Tooltip>
            );
          })}
        </AvatarGroup>
      </div>
    );
  }
);

export default MemberAvatarGroup;
