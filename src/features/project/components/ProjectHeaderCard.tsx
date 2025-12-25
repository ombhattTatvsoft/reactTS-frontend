import { useNavigate } from 'react-router-dom';
import Card from '../../../common/components/UI/Card'
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getTimeAgo } from '../../../utils/dateTime.util';
import type { Project, projectRole } from '../projectSlice';
import ProjectConfigModal from './ProjectConfigModal';

const ProjectHeaderCard = ({project, currentProjectRole} : {project : Project, currentProjectRole : projectRole}) => {
  const navigate = useNavigate();

  const StatusBadge = ({ status }: { status: Project["status"] }) => {
    const config = {
      pending: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: Circle,
        label: "Pending",
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
  return (
    <Card className="bg-white p-7">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {/* Header */}
                <div className="flex justify-between flex-wrap gap-4 border-b border-gray-100 mb-2 pb-2">
                  <div className="flex gap-3 items-start">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft size={22} className="text-gray-600" />
                    </button>

                    <div className="space-y-1">
                      <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {project.name}
                      </h1>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> Updated{" "}
                        {getTimeAgo(project.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-sm text-gray-600 gap-2">
                    <div className='flex items-center gap-3'>
                        <StatusBadge status={project.status} />
                        {currentProjectRole === "owner" && <ProjectConfigModal />}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700`}
                    >
                      <Calendar size={14} className="text-green-500" />
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <div
                    className="description-box max-h-[215px] hide-scrollbar"
                    dangerouslySetInnerHTML={{
                      __html: project.description,
                    }}
                  />
                )}
              </div>
            </div>
          </Card>
  )
}

export default ProjectHeaderCard