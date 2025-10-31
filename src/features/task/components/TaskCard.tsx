import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  Circle,
  Edit2,
  Trash2,
  User,
} from "lucide-react";
import Card from "../../../common/components/UI/Card";
import { Tooltip } from "@mui/material";
import type { Task } from "../taskSlice";
import type { projectRole } from "../../project/projectSlice";
import { getUserData } from "../../../utils/manageUserData";
import { useNavigate } from "react-router-dom";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  currentProjectRole,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  currentProjectRole: projectRole;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const user = getUserData();
  const userId = user._id;
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task._id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task._id}`);
  };

  const priorityIcons = {
    low: <Circle size={14} />,
    medium: <AlertCircle size={14} />,
    high: <AlertCircle size={14} />,
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`transition-all cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="bg-white p-6">
        <div onClick={handleCardClick}>
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 leading-tight pr-2 truncate hover:text-indigo-600 transition-colors">
                {task.title}
              </h3>
              <Tooltip
                title={task.description ? (<div
                  dangerouslySetInnerHTML={{
                    __html: task.description,
                  }}
                />) : ''}
                arrow
              >
                <div
                  className="prose prose-sm max-w-none text-sm text-gray-600 min-h-10 max-h-12 overflow-y-auto hide-scrollbar wrap-break-word relative"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    whiteSpace: "normal",
                    display: "block",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: task.description,
                  }}
                />
              </Tooltip>
            </div>

            {(currentProjectRole === "owner" ||
              (currentProjectRole === "manager" &&
                task.assignee._id !== userId)) && (
              <div
                className="flex gap-2 ml-4 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip title="Edit Task" arrow>
                  <button onClick={onEdit} className="edit-btn">
                    <Edit2 size={18} />
                  </button>
                </Tooltip>
                <Tooltip title="Delete Task" arrow>
                  <button onClick={onDelete} className="delete-btn">
                    <Trash2 size={18} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.tags.map((tag, idx) => (
              <span key={idx} className={`tag-pill tag-pill-${idx % 2}`}>
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
            <User size={12} />
            <span>
              {typeof task.assignee !== "string" ? task.assignee.name : ""}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={12} />
              <span>{task.dueDate.toString().substring(0, 10)}</span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 priority-${task.priority}`}
            >
              {priorityIcons[task.priority]}
              {task.priority}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
