import { useMemo } from "react";
import { backendUrl } from "../../../common/api/baseApi";
import DefaultAvatar from "../../../common/components/UI/DefaultAvatar";
import { getTimeAgo } from "../../../utils/dateTime.util";
import type { CommentItem, Task } from "../taskSlice";
import Parser, { domToReact, Element, type DOMNode } from "html-react-parser";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} arrow placement="top" />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: { color: theme.palette.common.black },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: "0.875rem",
  },
}));

type Props = {
  comment: CommentItem;
  members?: Task["projectMembers"];
};

const CommentsDiv = ({ comment, members = [] }: Props) => {
  const processedContent = useMemo(() => {
    return Parser(comment.text, {
      replace: (domNode: DOMNode) => {
        if (
          domNode instanceof Element &&
          domNode.name === "span" &&
          domNode.attribs?.class?.includes("mention")
        ) {
          const userId = domNode.attribs["data-user-id"];
          const user = members.find((u) => u.user._id === userId);

          if (user) {
            const avatarUrl = user.user.avatar
              ? `${backendUrl}${user.user.avatar.startsWith("/") ? "" : "/"}${user.user.avatar}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.name)}&background=6366f1&color=fff`;

            return (
              <StyledTooltip
                title={
                  <div className="flex items-center gap-2 p-2">
                    <img
                      src={avatarUrl}
                      alt={user.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{user.user.name}</p>
                      {user.role && <p className="text-xs text-gray-300">{user.role}</p>}
                    </div>
                  </div>
                }
              >
                <span
                  className="hover:text-indigo-500 transition-all duration-200 mention"
                >
                  {domToReact(domNode.children as DOMNode[])}
                </span>
              </StyledTooltip>
            );
          }
        }
      },
    });
  }, [comment.text, members]);

  return (
    <div className="flex gap-3 border-b border-gray-100 last:border-0 pb-3 mb-3">
      {comment.user.avatar ? (
        <img
          src={`${backendUrl}${comment.user.avatar}`}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <DefaultAvatar name={comment.user.name} className="w-8 h-8 font-medium" />
      )}

      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1 text-xs text-gray-600">
          <span className="font-medium">{comment.user.name}</span>•
          <span>{getTimeAgo(comment.createdAt)}</span>
        </div>

        <div className="prose max-w-none">{processedContent}</div>
      </div>
    </div>
  );
};

export default CommentsDiv;
