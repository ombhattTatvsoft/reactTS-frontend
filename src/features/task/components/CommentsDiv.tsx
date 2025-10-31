import { backendUrl } from "../../../common/api/baseApi";
import DefaultAvatar from "../../../common/components/UI/DefaultAvatar";
import { getTimeAgo } from "../../../utils/dateTime.util";
import type { CommentItem } from "../taskSlice";

const CommentsDiv = ({ comment }: { comment: CommentItem }) => {
  return (
    <div className="flex gap-3 border-b border-gray-100 last:border-0 pb-3 mb-3">
      {comment.user.avatar ? (
        <img
          src={backendUrl + comment.user.avatar}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <DefaultAvatar
          name={comment.user.name}
          className="w-8 h-8 font-medium"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1 text-xs text-gray-600">
          <span className="font-medium">{comment.user.name}</span>•
          <span>{getTimeAgo(comment.createdAt)}</span>
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: comment.text,
          }}
        />
      </div>
    </div>
  );
};

export default CommentsDiv;
