import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Circle,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import FormButton from "../../../common/components/UI/FormButton";
import SearchInput from "../../../common/components/UI/SearchInput";
import FormSelect from "../../../common/components/UI/FormSelect";
import TaskColumn from "../components/TaskColumn";
import CommonModal from "../../../common/components/UI/Modal";
import TaskForm from "../components/TaskForm";
import type { AppDispatch, RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import type { TaskPayload } from "../taskSchema";
import {
  deleteTask,
  getTasks,
  updateTaskStatus,
  type Task,
} from "../taskSlice";
import Loader from "../../../common/components/UI/Loader";
import DeleteModal from "../../../common/components/UI/DeleteModal";
import { useParams } from "react-router-dom";
import {
  getProject,
  getProjectConfig,
  type ProjectResponse,
  type projectRole,
} from "../../project/projectSlice";
import { getUserData } from "../../../utils/manageUserData";
import type { ApiResponse } from "../../../common/api/baseApi";
import MemberCard from "../components/MemberCard";
import ProjectHeaderCard from "../../project/components/ProjectHeaderCard";

const TaskPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = useParams<{ projectId: string }>();
  const { loading: taskLoading, tasks } = useSelector(
    (state: RootState) => state.task
  );
  const { loading: projectLoading, project, projectConfig } = useSelector(
  (state: RootState) => state.project
  );
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskPayload | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("0");
  const [filterByPriority, setFilterByPriority] = useState("all");
  const [filterByMember, setFilterByMember] = useState<string | null>(null);
  const currentProjectRole = useRef<projectRole>("developer");

  if (!projectId) {
    throw new Error("Project ID not found in URL");
  }

  useEffect(() => {
    dispatch(getTasks(projectId));
    dispatch(getProjectConfig(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    const getProjectAndCurrentRole = async () => {
      const result = (await dispatch(getProject(projectId)))
        .payload as ApiResponse<ProjectResponse>;
      currentProjectRole.current = result.data!.project.members.find(
        (u) => u.user._id === getUserData()._id
      )!.role;
    };
    getProjectAndCurrentRole();
  }, [dispatch, projectId]);

  const formatEdit = useCallback((task: Task): TaskPayload => {
    const { assignee, tags, ...rest } = task;
    return {
      ...rest,
      deletedFilenames: [],
      assignee: typeof assignee === "string" ? assignee : assignee._id,
      tags: Array.isArray(tags) ? tags.join(", ") : tags || "",
    };
  }, []);

  const handleEditTask = useCallback(
    (task: Task) => {
      setEditingTask(formatEdit(task));
      setOpenModal(true);
    },
    [formatEdit]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedId) return;
    await dispatch(deleteTask(selectedId))
      .unwrap()
      .then(async () => await dispatch(getTasks(projectId)));
    setDeleteModalOpen(false);
    setSelectedId(null);
  }, [selectedId, dispatch, projectId]);

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedId(null);
  };

  const handleDrop = useCallback(
    async (taskId: string, newStatus: Task["status"]) => {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== newStatus) {
        await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
      }
    },
    [dispatch, tasks]
  );

  const filteredTasks = tasks.filter((task) => {
    if (filterByStatus !== "0" && task.status !== filterByStatus)
      return false;
    if (filterByPriority !== "all" && task.priority !== filterByPriority)
      return false;
    if (filterByMember && task.assignee._id !== filterByMember) return false;
    if (
      search &&
      !task.title.toLowerCase().includes(search.toLowerCase()) &&
      !task.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const hasActiveFilters =
    search !== "" ||
    filterByStatus !== "0" ||
    filterByPriority !== "all" ||
    filterByMember;

  if (taskLoading || projectLoading) return <Loader />;

  const taskStages = projectConfig?.TaskStages.filter(t => t.isActive).sort((a,b) => a.order - b.order);
  const statusOptions = taskStages?.map(stage => ({ label: stage.name, value: stage._id })) || [];
  const stagesCount = taskStages?.length || 0;
  return (
    <>
      <div className={stagesCount < 4 ?'max-w-7xl mx-auto space-y-5' : 'space-y-5'}>
        {project && projectConfig &&(
          <ProjectHeaderCard project={project} currentProjectRole={currentProjectRole.current}/>
        )}

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Tasks</h2>
                <p className="text-sm text-gray-600">
                  Manage and track all your tasks
                </p>
              </div>
              {(currentProjectRole.current === "owner" ||
                currentProjectRole.current === "manager") && (
                <FormButton
                  type="button"
                  name="addTask"
                  label="New Task"
                  onClick={() => {
                    setEditingTask(null);
                    setOpenModal(true);
                  }}
                  startIcon={<Plus size={20} />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[35%_23%_23%_15%] gap-3 mb-5">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by task name or description..."
              />
              <FormSelect
                type="select"
                label="Status"
                name="filterByStatus"
                value={filterByStatus}
                onChange={(e) =>
                  setFilterByStatus((e.target as HTMLSelectElement).value)
                }
                options={[{ label: "All", value: "0" }, ...statusOptions]}
              />
              <FormSelect
                type="select"
                label="Priority"
                name="filterByPriority"
                value={filterByPriority}
                onChange={(e) =>
                  setFilterByPriority((e.target as HTMLSelectElement).value)
                }
                options={[
                  { label: "All", value: "all" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ]}
              />

              <div className="flex items-center">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterByStatus("0");
                      setFilterByPriority("all");
                      setFilterByMember(null);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]" style={{ "--cols": stagesCount } as React.CSSProperties}>
              {taskStages?.map((stage,_index) => 
              <TaskColumn
                key={stage._id}
                title={stage.name}
                status={stage._id}
                icon={_index == 0 ? <Circle className="text-blue-500" size={20} /> : _index == stagesCount-1 ? <CheckCircle className="text-blue-500" size={20} /> : <Clock className="text-yellow-500" size={20} />}
                tasks={filteredTasks.filter((t) => t.status.toString() === stage._id)}
                onDrop={handleDrop}
                onEdit={handleEditTask}
                onDelete={handleDeleteClick}
                currentProjectRole={currentProjectRole.current}
              />
              )}
            </div>
          </div>

          {project && (
            <div className="lg:col-span-1 bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-100 max-h-[calc(100vh-150px)] self-start">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={18} className="text-teal-500" /> Members
                </h2>
                <span className="text-xs text-gray-500">
                  {project.members.length} total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 overflow-y-auto hide-scrollbar pr-1 cursor-pointer">
                {project.members.map((m) => (
                  <MemberCard
                    currentProjectRole={currentProjectRole.current}
                    key={m.user._id}
                    member={{
                      _id: m.user._id,
                      name: m.user.name,
                      email: m.user.email,
                      role: m.role,
                      avatar: m.user.avatar,
                      joinedAt: m.joinedAt,
                    }}
                    taskCount={
                      tasks.filter(
                        (t) =>
                          (typeof t.assignee === "string"
                            ? t.assignee
                            : t.assignee?._id) === m.user._id
                      ).length
                    }
                    onFilter={setFilterByMember}
                    isFiltered={filterByMember === m.user._id}
                  />
                ))}
                
              </div>
            </div>
          )}
        </div>
      </div>

      <CommonModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`${editingTask ? "Update" : "Add"} Task`}
      >
        <TaskForm
          initialValues={editingTask}
          setShowModal={setOpenModal}
          projectId={projectId}
          projectConfig={projectConfig}
          allMembers={{
            members: project?.members || [],
            pendingMembers: project?.pendingMembers || [],
          }}
        />
      </CommonModal>
      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
      />
    </>
  );
};

export default TaskPage;
