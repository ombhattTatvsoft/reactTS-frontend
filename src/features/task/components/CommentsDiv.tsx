import { getTimeAgo } from "../../../utils/dateTime.util";
import type { CommentItem } from "../taskSlice";

const CommentsDiv = ({ comment }: { comment: CommentItem }) => {
  return (
    <div className="flex gap-3 border-b border-gray-100 last:border-0 pb-3 mb-3">
      <img
        src={comment.user.avatar}
        alt={comment.user.name}
        className="w-8 h-8 rounded-full"
      />
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
