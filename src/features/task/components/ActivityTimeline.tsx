import { formatDate } from '../../../utils/dateTime.util';
import type { TaskActivity } from '../taskSlice';
import { 
    Plus, 
    FileText, 
    Edit3,
    User,
  } from "lucide-react";
  
interface ActivityTimelineProps{
    activities: TaskActivity[];
}

  const ActivityTimeline = ({ activities } : ActivityTimelineProps) => {

    const getActivityConfig = (action : TaskActivity['action']) => {
      const configs = (action: TaskActivity['action']) => {
        if(action == undefined || action == null)
          return {
            icon: Plus,
            color: "blue",
            title: "Task Created",
            description: "Created this task",
          }
        switch (action.field) {
          case "title":
          case "assignee":
          case "status":
          case "priority":
            return {
              icon: Edit3,
              color: "purple",
              title: `Changed ${action.field.charAt(0).toUpperCase() + action.field.slice(1)}`,
              description: `Updated ${action.field} from ${action.oldValue?.replace('-',' ')} to ${action.newValue?.replace('-',' ')}`,
            };
          case "dueDate":
            return {
              icon: Edit3,
              color: "purple",
              title: `Changed Due Date`,
              description: `Updated due date from ${formatDate(action.oldValue!)} to ${formatDate(action.newValue!)}`,
            };
          case "attachments":
            if (action.newValue && !action.oldValue) {
              return {
                icon: FileText,
                color: "green",
                title: "Attachment Added",
                description: action.newValue,
              };
            } else 
              return {
                icon: FileText,
                color: "red",
                title: "Attachment Removed",
                description: action.oldValue,
              };
          case "description":
            return {
              icon: Edit3,
              color: "purple",
              title: `Changed Description`,
              description: '',
            };
          default:
            return {
              icon: Plus,
              color: "blue",
              title: "Task Updated",
              description: "Updated this task",
            };
        }
      };
      return configs(action);
    };
  
    if (!activities || activities.length === 0) {
      return (
        <div >
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Activity
          </h3>
          <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
        </div>
      );
    }
  
    return (

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Activity
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const config = getActivityConfig(activity.action);
            const isLast = index === activities.length - 1;
            const user = activity.performedBy;
  
            return (
              <div key={activity._id} className="relative pl-10">
                {!isLast && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-linear-to-b from-gray-300 to-red-300" />
                )}

                <div className="group flex gap-4 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-gray-200 hover:shadow-md">
                  
                  <div
                    className={`
                      absolute left-1 top-3
                      flex h-8 w-8 items-center justify-center rounded-full
                      bg-${config.color}-100 text-${config.color}-600
                      ring-4 ring-white
                    `}
                  >
                    <config.icon size={14} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-gray-900">
                        {config.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {formatDate(activity.performedAt)}
                      </span>
                    </div>

                    {config.description && (
                      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                        {config.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                      <User size={11} />
                      <span className="font-medium">
                        {user.name || "Unknown User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default ActivityTimeline;