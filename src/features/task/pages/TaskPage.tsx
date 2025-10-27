import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Clock, CheckCircle2, Circle } from "lucide-react";
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
  getProjectMembers,
  type ProjectMembersResponse,
  type projectRole,
} from "../../project/projectSlice";
import { getUserData } from "../../../utils/manageUserData";
import type { ApiResponse } from "../../../common/api/baseApi";
import MemberCard from "../components/MemberCard";
import Card from "../../../common/components/UI/Card";

const TaskPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = useParams<{ projectId: string }>();
  const { loading, tasks } = useSelector((state: RootState) => state.task);
  const { allMembers } = useSelector((state: RootState) => state.project);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskPayload | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [filterByPriority, setFilterByPriority] = useState("all");
  const [filterByMember, setFilterByMember] = useState<string | null>(null);
  const currentProjectRole = useRef<projectRole>("developer");

  if (!projectId) {
    throw new Error("Project ID not found in URL");
  }

  useEffect(() => {
    // if (!tasks.length) {
    dispatch(getTasks(projectId));
    // }
  }, [dispatch, projectId]);

  useEffect(() => {
    const getMembers = async () => {
      const result = (await dispatch(getProjectMembers(projectId)))
        .payload as ApiResponse<ProjectMembersResponse>;
      currentProjectRole.current = result.data!.allMembers.members.find(
        (u) => u.user._id === getUserData()._id
      )!.role;
    };
    getMembers();
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
    if (filterByStatus !== "all" && task.status !== filterByStatus)
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
    filterByStatus !== "all" ||
    filterByPriority !== "all" ||
    filterByMember;

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="lg:col-span-4 col-span-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-600">Manage and track all your tasks</p>
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
        <div className="grid grid-cols-1 md:grid-cols-[35%_23%_23%_15%] gap-3">
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
            options={[
              { label: "All Status", value: "all" },
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ]}
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
                  setFilterByStatus("all");
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TaskColumn
            title="To Do"
            status="todo"
            icon={<Circle className="text-blue-500" size={20} />}
            tasks={filteredTasks.filter((t) => t.status === "todo")}
            onDrop={handleDrop}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
            currentProjectRole={currentProjectRole.current}
          />
          <TaskColumn
            title="In Progress"
            status="in-progress"
            icon={<Clock className="text-yellow-500" size={20} />}
            tasks={filteredTasks.filter((t) => t.status === "in-progress")}
            onDrop={handleDrop}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
            currentProjectRole={currentProjectRole.current}
          />
          <TaskColumn
            title="Completed"
            status="completed"
            icon={<CheckCircle2 className="text-green-500" size={20} />}
            tasks={filteredTasks.filter((t) => t.status === "completed")}
            onDrop={handleDrop}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
            currentProjectRole={currentProjectRole.current}
          />
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
            allMembers={allMembers}
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
      </div>
      <div className="lg:col-span-1 col-span-5">
        <div className="text-2xl my-2 text-center">Members</div>
        <Card className="bg-gray-200/50 lg:block lg:max-h-[calc(100vh-225px)] overflow-y-auto hide-scrollbar p-1 cursor-pointer flex overflow-x-auto">
          {allMembers.members.map((m) => (
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
        </Card>
        
      </div>
    </div>
  );
};

export default TaskPage;
