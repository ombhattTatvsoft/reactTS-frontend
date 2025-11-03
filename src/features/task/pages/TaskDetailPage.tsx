import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
} from "lucide-react";
import AttachmentUploader from "../components/AttachmentUploader";
import {
  addComment,
  attachmentsUpdatedLocal,
  commentReceived,
  getTask,
  saveTaskAttachments,
  type Task,
} from "../taskSlice";
import { getUserData } from "../../../utils/manageUserData";
import RichTextEditor from "../../../common/components/UI/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../common/components/UI/Card";
import FormButton from "../../../common/components/UI/FormButton";
import { formatDate, getTimeAgo } from "../../../utils/dateTime.util";
import type { AppDispatch, RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/components/UI/Loader";
import { backendUrl } from "../../../common/api/baseApi";
import DefaultAvatar from "../../../common/components/UI/DefaultAvatar";
import socket from "../../../utils/socket";
import CommentsList from "../components/CommentsList";

// Components
const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const config = {
    todo: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: Circle,
      label: "To Do",
    },
    "in-progress": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: AlertCircle,
      label: "In Progress",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "Completed",
    },
  };
  const { bg, text, icon: Icon, label } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${bg} ${text}`}
    >
      <Icon size={14} />
      {label}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const config = {
    low: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "low",
    },
    medium: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
      label: "medium",
    },
    high: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "high",
    },
  };
  const { bg, text, dot, label } = config[priority];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {label}
    </span>
  );
};

const TaskDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = useParams<{ taskId: string }>();
  const { loading, task } = useSelector((state: RootState) => state.task);

  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  if (!taskId) {
    throw new Error("Task ID not found in URL");
  }

  useEffect(() => {
    dispatch(getTask(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    socket.on("comment:new", ({ taskId, comment }) =>
      dispatch(commentReceived({ taskId, comment }))
    );
    socket.on("task:attachments:updated", ({ taskId, attachments }) =>
      dispatch(attachmentsUpdatedLocal({ taskId, attachments }))
    );

    return () => {
      socket.off("comment:new");
      socket.off("task:attachments:updated");
    };
  }, [dispatch]);

  const handleAddComment = async () => {
    if (!newComment.trim() || newComment === "<p></p>") return;
    try {
      await dispatch(addComment({ taskId, text: newComment })).unwrap();
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  const handleSaveAttachments = async (payload: {
    files: File[];
    deletedFilenames: string[];
  }) => {
    try {
      await dispatch(saveTaskAttachments({ taskId, ...payload })).unwrap();
    } catch (err) {
      console.error("Error saving attachments", err);
    }
  };

  // const mentions = task?.projectMembers?.map((member) => (`@${member.user.name}`)) || [];
  if (!task || loading) return <Loader />;
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white p-7">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex gap-3 items-start">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={22} className="text-gray-600" />
            </button>

            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} /> Updated {getTimeAgo(task.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {task.description && (
          <div
            className="description-box mt-5 hide-scrollbar max-h-[200px]"
            dangerouslySetInnerHTML={{
              __html: task.description,
            }}
          />
        )}
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Attachments */}
          <Card className="p-6 bg-white">
            <AttachmentUploader
              value={task.attachments || []}
              showSaveButton={true}
              onSave={handleSaveAttachments}
              currentUserId={getUserData()._id}
              maxFiles={5}
              maxSizeInMB={5}
              allowDelete={
                task.assigneeRole === "manager" || task.assigneeRole === "owner"
              }
            />
          </Card>

          {/* Comments */}
          <Card className="p-6 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-500" />
              Comments
              <span className="text-xs bg-gray-100 text-gray-600 px-2 rounded-md">
                {task.comments.length}
              </span>
            </h3>

            <CommentsList comments={task.comments} members={task.projectMembers}/>

            <div className="space-y-4">
              <RichTextEditor value={newComment} onChange={setNewComment} mentions={task.projectMembers}/>

              <div className="flex justify-end">
                <FormButton
                  type="button"
                  name="addComment"
                  variant="contained"
                  label="Add Comment"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || newComment === "<p></p>"}
                  startIcon={<Send size={14} />}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Info */}
          <Card className="bg-white p-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Task Details
            </h3>

            <div className="space-y-6">
              {/* Assignee */}
              <div className="flex gap-3 items-start">
                {task.assignee.avatar ? (
                  <img
                    src={backendUrl + task.assignee.avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <DefaultAvatar
                    name={task.assignee.name}
                    className="w-10 h-10 font-medium"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.assignee.name}
                  </p>
                  <p className="text-xs text-gray-500">{task.assignee.email}</p>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">
                  Due Date
                </h4>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(task.dueDate)}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className={`tag-pill tag-pill-${idx % 2}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Activity */}
          <Card className="bg-white p-6 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Activity
            </h3>

            <div className="space-y-5">
              {[task.createdBy, task.updatedBy].map((user, i) => (
                <div key={i} className="flex items-start gap-3">
                  {user.avatar ? (
                    <img
                      src={backendUrl + user.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar
                      name={task.assignee.name}
                      className="w-10 h-10 font-medium"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {i === 0 ? "Created this task" : "Last updated"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {getTimeAgo(i === 0 ? task.createdAt : task.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
