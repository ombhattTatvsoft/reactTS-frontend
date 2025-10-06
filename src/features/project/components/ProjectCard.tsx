import { Calendar, Edit2, Trash2, Users } from "lucide-react";
import Card from "../../../common/components/UI/Card";
import type { user } from "../../auth/authSlice";
import type { ProjectMember } from "../projectSlice";

interface projectCardProps {
  name: string;
  desc?: string;
  owner: user;
  startDate: string;
  endDate: string;
  status: string;
  members: ProjectMember[];
  // priority?: string;
  // progress: number;
}

const ProjectCard: React.FC<projectCardProps> = ({
  name,
  desc,
  owner,
  startDate,
  endDate,
  status,
  members,
  // priority,
  // progress,
}) => {
  return (
    <Card>
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
              {name}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-3">{desc}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => console.log("edit")}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => console.log("delete")}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-gray-400" />
            <span className="font-medium">{owner.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>
              {startDate.substring(0, 10)} - {endDate.substring(0, 10)}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold status-${status}`}>
            {status}
          </span>
        </div>

        {members.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Team</h4>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <div
                  key={member.user._id}
                  className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs uppercase font-bold">
                    {member.user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {member.user.name} ({member.role})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};

export default ProjectCard;
