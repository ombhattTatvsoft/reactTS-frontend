import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import AttachmentUploader from "../components/AttachmentUploader";
import type { AttachmentItem, CommentItem, Task } from "../taskSlice";
import { getUserData } from "../../../utils/manageUserData";
import RichTextEditor from "../../../common/components/UI/RichTextEditor";

// Dummy Data
const dummyTask: Task = {
  _id: "TSK-1847",
  projectId: "proj-1",
  title: "API Endpoint Setup",
  description:
    "Setup comprehensive REST API routes for tasks management system. This includes implementing CRUD operations for tasks, advanced filtering capabilities, search functionality with pagination, proper error handling middleware, request validation using Joi/Yup schemas, and comprehensive API documentation using Swagger/OpenAPI specifications. The implementation should follow RESTful best practices and include proper status codes for all responses.",
  status: "in-progress",
  priority: "medium",
  assignee: {
    _id: "2",
    name: "Tatva Dev",
    email: "tatva.dev@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tatva",
  },
  dueDate: new Date("2025-11-04"),
  tags: ["Backend", "API", "High Priority"],
  createdBy: {
    _id: "1",
    name: "John Manager",
    email: "john.manager@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  updatedBy: { _id: "1", name: "John Manager", email: "john@company.com" },
  attachments: [
    {
      fileName: "api-spec.pdf",
      originalName: "API Specification v2.1.pdf",
      url: "/uploads/api-spec.pdf",
      size: 245678,
      uploadedBy: "1",
    },
    {
      fileName: "design-mockup.png",
      originalName: "Design Mockup - Final.png",
      url: "/uploads/design.png",
      size: 512340,
      uploadedBy: "2",
    },
    {
      fileName: "requirements.docx",
      originalName: "Requirements Document.docx",
      url: "/uploads/req.docx",
      size: 89234,
      uploadedBy: "1",
    },
  ],
  createdAt: "2025-10-20T10:30:00Z",
  updatedAt: "2025-10-23T15:45:00Z",
  comments: [
    {
      id: "c1",
      user: {
        _id: "1",
        name: "John Manager",
        email: "john@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
      text: "<p>Please prioritize the authentication endpoints first. We need JWT implementation with refresh tokens.</p>",
      createdAt: "2025-10-21T09:00:00Z",
    },
    {
      id: "c2",
      user: {
        _id: "2",
        name: "Tatva Dev",
        email: "tatva@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tatva",
      },
      text: "<p>Working on it! Auth endpoints are <strong>80% complete</strong>. Added middleware for token validation.</p>",
      createdAt: "2025-10-22T14:30:00Z",
    },
    {
      id: "c3",
      user: {
        _id: "3",
        name: "Sarah Designer",
        email: "sarah@company.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      text: "<p>Added the updated design mockup to attachments. Please review the new color scheme.</p>",
      createdAt: "2025-10-23T11:15:00Z",
    },
  ],
  __v: 1,
};

// Utility Functions
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
};

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

const CommentItem = ({ comment }: { comment: CommentItem }) => (
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
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
    </div>
  </div>
);

const TaskDetailPage = ({ taskId }: { taskId: string }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Normally fetch from API
    setTask(dummyTask);
    setComments(dummyTask.comments);
    setAttachments(dummyTask.attachments);
  }, [taskId]);
  // Fetch task from backend
  // useEffect(() => {
  //   const fetchTask = async () => {
  //     try {
  //       const res = await axios.get(`/api/tasks/${taskId}`);
  //       setTask(res.data);
  //       setComments(res.data.comments || []);
  //       setAttachments(res.data.attachments || []);
  //     } catch (err) {
  //       console.error("Error fetching task", err);
  //     }
  //   };
  //   fetchTask();
  // }, [taskId]);

  const handleAddComment = () => {
    console.log(newComment);
    if (!newComment.trim() || newComment === "<p></p>") return;
    const user = getUserData();
    const comment: CommentItem = {
      id: `c${Date.now()}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      text: newComment,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment("");
  };
  // const handleAddComment = async () => {
  //   if (!newComment.trim() || newComment === "<p><br></p>") return;

  //   try {
  //     const res = await axios.post(`/api/tasks/${taskId}/comments`, {
  //       text: newComment,
  //       userId: getUserData()._id,
  //     });
  //     setComments([...comments, res.data]);
  //     setNewComment("");
  //   } catch (err) {
  //     console.error("Error adding comment", err);
  //   }
  // };

  const handleAttachmentsChange = (files: AttachmentItem[]) => {
    setAttachments(files);
    if (task) {
      setTask({ ...task, attachments: files });
    }
  };
  // const handleAttachmentsChange = async (files: AttachmentItem[]) => {
  //   try {
  //     const res = await axios.put(`/api/tasks/${taskId}/attachments`, { attachments: files });
  //     setAttachments(res.data);
  //     setTask({ ...task!, attachments: res.data });
  //   } catch (err) {
  //     console.error("Error updating attachments", err);
  //   }
  // };

  if (!task) return <div className="p-5">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{task.title}</h1>
              <p className="text-xs text-gray-500">{task._id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-12 gap-5">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip size={16} className="text-gray-500" /> Attachments
            </h3>
            <AttachmentUploader
              value={attachments}
              onChange={handleAttachmentsChange}
              currentUserId={getUserData()._id}
              maxFiles={5}
              maxSizeInMB={5}
            />
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-500" />
              Comments ({comments.length})
            </h3>

            <div className="overflow-y-auto max-h-72 mb-3">
              {comments.length ? (
                comments.map((c) => <CommentItem key={c.id} comment={c} />)
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">
                  No comments yet
                </p>
              )}
            </div>

            <RichTextEditor value={newComment} onChange={setNewComment} />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || newComment === "<p></p>"}
                className="flex items-center gap-1 px-3 py-1.5 text-white bg-purple-600 rounded text-xs disabled:opacity-50"
              >
                <Send size={14} /> Add Comment
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Assignee */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Assignee
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{task.assignee.name}</p>
                  <p className="text-xs text-gray-500">{task.assignee.email}</p>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Due Date
              </h3>
              <p className="text-sm text-gray-700">
                {formatDate(task.dueDate)}
              </p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Created / Updated By */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Created / Updated By
              </h3>
              <div className="flex items-center gap-3 mb-1">
                <img
                  src={task.createdBy.avatar}
                  alt={task.createdBy.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-xs font-medium">{task.createdBy.name}</p>
                  <p className="text-xs text-gray-500">Created</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={task.updatedBy.avatar || task.createdBy.avatar}
                  alt={task.updatedBy.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-xs font-medium">{task.updatedBy.name}</p>
                  <p className="text-xs text-gray-500">Updated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
