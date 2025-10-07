import { Calendar, Edit2, Trash2, Users } from "lucide-react";
import Card from "../../../common/components/UI/Card";
import type { user } from "../../auth/authSlice";
import type { ProjectMember } from "../projectSlice";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";

interface projectCardProps {
  name: string;
  desc?: string;
  owner: user;
  startDate: string;
  endDate: string;
  status: string;
  members: ProjectMember[];
  pendingMembers: Omit<user, "_id">[];
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
  pendingMembers,
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
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold status-${status}`}
          >
            {status}
          </span>
        </div>

          <div className="flex justify-between">
            {members.length > 0 && (
              <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Team</h4>
              <div className="flex">
                <AvatarGroup max={6}>
                  {members.map((member) => (
                    <Tooltip
                      key={member.user._id}
                      title={`${member.user.name} (${member.role})`}
                      arrow
                    >
                      <Avatar
                        sx={{
                          background:
                            "linear-gradient(to right, #6366F1, #8B5CF6)",
                          fontSize: 14,
                          height: 36,
                          width: 36,
                        }}
                      >
                        {member.user.name
                          .split(" ")
                          .map((p) => p.charAt(0))
                          .join("")}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </div>
            </div>
            )}
            {pendingMembers.length > 0 && (
              <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Pending members</h4>
              <div className="flex">
                <AvatarGroup max={6}>
                  {pendingMembers.map((member) => (
                    <Tooltip
                      title={`${member.email} (${member.role})`}
                      arrow
                    >
                      <Avatar
                        sx={{
                          background:
                            "linear-gradient(to right, #6366F1, #8B5CF6)",
                          fontSize: 14,
                          height: 36,
                          width: 36,
                        }}
                      >
                        {member.email
                          .split(" ")
                          .map((p) => p.charAt(0))
                          .join("")}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </div>
            </div>
            )}
          </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
