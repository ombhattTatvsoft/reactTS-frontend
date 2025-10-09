import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Target } from "lucide-react";
import FormButton from "../../../common/components/UI/FormButton";
import CommonModal from "../../../common/components/UI/Modal";
import ProjectForm from "../components/ProjectForm";
import type { ProjectPayload } from "../projectSchema";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { deleteProject, getProjects, type Project, type projectRole } from "../projectSlice";
import Loader from "../../../common/components/UI/Loader";
import ProjectSection from "../components/ProjectSection";
import DeleteModal from "../../../common/components/UI/DeleteModal";

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

  useEffect(() => {
    if (!projects.myProjects.length && !projects.assignedProjects.length) {
      dispatch(getProjects());
    }
  }, [dispatch, projects.myProjects.length, projects.assignedProjects.length]);

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
  },[]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedId) return;
    await dispatch(deleteProject(selectedId)).unwrap().then(async () => await dispatch(getProjects()));
    setDeleteModalOpen(false);
    setSelectedId(null);
  },[selectedId,dispatch]);

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedId(null);
  };

  const isEmpty = useMemo(
    () =>
      projects.myProjects.length === 0 &&
      projects.assignedProjects.length === 0,
    [projects.myProjects.length, projects.assignedProjects.length]
  );

  if (loading) return <Loader />;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>
        <FormButton
          type="button"
          name="addProject"
          variant="contained"
          label="New Project"
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          className="transform hover:-translate-y-0.5"
          startIcon={<Plus size={20} />}
          sx={{
            px: 3,
            py: 1.5,
            textTransform: "none",
          }}
        />
      </div>

      {isEmpty && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      )}

      <ProjectSection
        title="My Projects"
        projects={projects.myProjects}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <ProjectSection
        title="Assigned Projects"
        projects={projects.assignedProjects}
        isAssigned
      />

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
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
      />
    </>
  );
};

export default ProjectPage;
