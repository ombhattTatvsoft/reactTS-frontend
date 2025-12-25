import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Target } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import {
  deleteProject,
  getProjects,
  type Project,
  type projectRole,
} from "../projectSlice";
import type { ProjectPayload } from "../projectSchema";
import FormButton from "../../../common/components/UI/FormButton";
import CommonModal from "../../../common/components/UI/Modal";
import ProjectForm from "../components/ProjectForm";
import Loader from "../../../common/components/UI/Loader";
import ProjectSection from "../components/ProjectSection";
import DeleteModal from "../../../common/components/UI/DeleteModal";
import SearchInput from "../../../common/components/UI/SearchInput";
import FormSelect from "../../../common/components/UI/FormSelect";

const ProjectPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, projects } = useSelector(
    (state: RootState) => state.project
  );

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectPayload | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // if (!projects.myProjects.length && !projects.assignedProjects.length) {
      dispatch(getProjects());
    // }
  }, [dispatch]);

  const formatEdit = useCallback((project: Project): ProjectPayload => {
    return {
      _id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      members: [
        ...project.members
          .filter((m) => m.role !== "owner")
          .map((m) => ({
            email: m.user.email,
            role: m.role as Exclude<projectRole, "owner">,
          })),
        ...project.pendingMembers.map((m) => ({
          email: m.email,
          role: m.role,
        })),
      ],
    };
  }, []);

  const handleEdit = useCallback(
    (project: Project) => {
      setEditingProject(formatEdit(project));
      setShowModal(true);
    },
    [formatEdit]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedId) return;
    await dispatch(deleteProject(selectedId))
      .unwrap()
      .then(async () => await dispatch(getProjects()));
    setDeleteModalOpen(false);
    setSelectedId(null);
  }, [selectedId, dispatch]);

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedId(null);
  };

  const filterProjects = useCallback(
    (list: Project[]) => {
      return list.filter((project) => {
        const matchStatus =
          statusFilter === "all" || project.status === statusFilter;
        const matchSearch =
          searchQuery === "" ||
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
      });
    },
    [searchQuery, statusFilter]
  );

  const filteredMyProjects = useMemo(
    () => filterProjects(projects.myProjects),
    [projects.myProjects, filterProjects]
  );

  const filteredAssignedProjects = useMemo(
    () => filterProjects(projects.assignedProjects),
    [projects.assignedProjects, filterProjects]
  );

  const isEmpty = useMemo(
    () =>
      filteredMyProjects.length === 0 && filteredAssignedProjects.length === 0,
    [filteredMyProjects.length, filteredAssignedProjects.length]
  );

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>
        <FormButton
          type="button"
          name="addProject"
          label="New Project"
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          startIcon={<Plus size={20} />}
          sx={{
            px: 3,
            py: 1.5,
            "&:hover": { transform: "scale(1.05)" },
          }}
        />
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-[40%_30%_30%] gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by project name or description..."
        />
        <FormSelect
          type="select"
          label="Status"
          name="filterByStatus"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter((e.target as HTMLSelectElement).value)
          }
          options={[
            { label: "All Status", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "inprogress" },
            { label: "Completed", value: "completed" },
          ]}
        />

        <div className="flex items-center">
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {isEmpty && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {hasActiveFilters
              ? "No projects match your filters"
              : "No projects found"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Project Sections */}
      <ProjectSection
        title="My Projects"
        projects={filteredMyProjects}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <ProjectSection
        title="Assigned Projects"
        projects={filteredAssignedProjects}
        isAssigned
      />

      {/* Modals */}
      <CommonModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={`${editingProject ? "Update" : "Add"} Project`}
      >
        <ProjectForm
          initialValues={editingProject}
          setShowModal={setShowModal}
        />
      </CommonModal>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description="Are you sure you want to delete this project? Subsequent tasks will also be deleted. This action cannot be undone."
        confirmText="Delete Project"
      />
    </div>
  );
};

export default ProjectPage;
