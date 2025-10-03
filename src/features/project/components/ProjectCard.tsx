import { Calendar, Edit2, Trash2, Users } from "lucide-react";
import Card from "../../../common/components/UI/Card";

interface projectCardProps {
  name: string;
  desc: string;
  manager?: string;
  startDate: string;
  endDate: string;
  status: string;
  priority?: string;
  progress: number;
}

const ProjectCard: React.FC<projectCardProps> = ({
  name,
  desc,
  manager,
  startDate,
  endDate,
  status,
  priority,
  progress,
}) => {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{desc}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => console.log("edit")}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => console.log("delete")}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-gray-400" />
          <span className="text-gray-700">{manager}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-gray-700">
            {startDate} - {endDate}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium status-${status}`}
        >
          {status}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium priority-${priority}`}
        >
          {priority}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-indigo-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
