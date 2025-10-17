import { Calendar, Edit2, Trash2, Users } from "lucide-react";
import Card from "../../../common/components/UI/Card";
import type { Project } from "../projectSlice";
import { useMemo } from "react";
import MemberAvatarGroup from "./MemberAvatarGroup";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  isAssigned: boolean;
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
}

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  isAssigned,
  project,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project._id}/tasks`);
  };

  const members = useMemo(
    () =>
      project.members.map((member) => ({
        key: member.user._id,
        label: `${member.user.name} (${member.role})`,
        initials: member.user.name
          .split(" ")
          .map((p) => p.charAt(0).toUpperCase())
          .join(""),
      })),
    [project.members]
  );

  const pendingMembers = useMemo(
    () =>
      project.pendingMembers.map((member) => ({
        key: member.email,
        label: `${member.email} (${member.role})`,
        initials: member.email
          .split(" ")
          .map((p) => p.charAt(0).toUpperCase())
          .join(""),
      })),
    [project.pendingMembers]
  );

  return (
    <Card className="bg-white p-6">
      <div className="flex flex-col h-full justify-between cursor-pointer" onClick={handleCardClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <Tooltip title={project.description} arrow>
              <p className="text-gray-500 text-sm md:h-[40px] line-clamp-2">
                {project.description}
              </p>
            </Tooltip>
          </div>

          {!isAssigned && (
            <div className="flex gap-2 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Edit Project" arrow>
                <button
                  onClick={onEdit}
                  className="edit-btn"
                >
                  <Edit2 size={18} />
                </button>
              </Tooltip>
              <Tooltip title="Delete Project" arrow>
                <button
                  onClick={onDelete}
                  className="delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
            <Users size={16} className="text-gray-400" />
            <span className="font-medium">{project.owner.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize status-${project.status}`}
          >
            {project.status}
          </span>
        </div>

        {/* Members */}
        <div className="flex justify-between flex-wrap gap-3">
          {members.length > 0 && (
            <MemberAvatarGroup title="Team" members={members} />
          )}
          {pendingMembers.length > 0 && (
            <MemberAvatarGroup
              title="Pending Members"
              members={pendingMembers}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
