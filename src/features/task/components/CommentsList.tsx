import { useEffect, useRef } from "react";
import CommentsDiv from "./CommentsDiv";
import type { CommentItem } from "../taskSlice";

const CommentsList = ({ comments }: { comments: CommentItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [comments]);

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-72 pr-2 mb-4">
      {comments.length ? (
        comments.map((c) => <CommentsDiv key={c._id} comment={c} />)
      ) : (
        <p className="text-xs text-gray-400 py-6 text-center">
          No comments available
        </p>
      )}
    </div>
  );
};

export default CommentsList;
