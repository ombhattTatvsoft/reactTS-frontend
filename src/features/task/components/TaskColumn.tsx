import { useState } from "react";
import { Target } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task } from "../taskSlice";
import type { projectRole } from "../../project/projectSlice";

// Task Column Component
const TaskColumn = ({
  title,
  status,
  tasks,
  icon,
  onDrop,
  onEdit,
  onDelete,
  currentProjectRole
}: {
  title: string;
  status: string;
  tasks: Task[];
  icon: React.ReactNode;
  onDrop: (taskId: string, newStatus: Task["status"]) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  currentProjectRole : projectRole;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    onDrop(taskId, status as Task["status"]);
  };

  return (
    <div
      className={`bg-gray-200/50 rounded-xl p-4 flex flex-col transition-colors ${
        isDragOver ? "bg-purple-50 ring-2 ring-purple-300" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-800">{title}</h2>
        </div>
        <span className="text-sm font-medium text-gray-500 bg-white px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[calc(100vh-496px)] md:min-h-[calc(100vh-396px)] hide-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task._id)}
              currentProjectRole={currentProjectRole}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Target size={38} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
