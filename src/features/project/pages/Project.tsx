import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";
import FormButton from "../../../common/components/UI/FormButton";
import ProjectCard from "../components/ProjectCard";
import CommonModal from "../../../common/components/UI/Modal";
import ProjectForm from "../components/ProjectForm";
import type { ProjectPayload } from "../projectSchema";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { getProjects } from "../projectSlice";
import Loader from "../../../common/components/UI/Loader";

const Project = () => {
  const { loading, projects } = useSelector(
    (state: RootState) => state.project
  );
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectPayload | null>(
    null
  );
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

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
        ></FormButton>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-2">My Projects</h1>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              name={project.name}
              desc={project.description}
              owner={project.owner}
              startDate={project.startDate}
              endDate={project.endDate}
              status={project.status}
              members={project.members}
              pendingMembers={project.pendingMembers}
              // priority={project.priority}
              // progress={project.progress}
            ></ProjectCard>
          ))}
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Assigned Projects
      </h1>

      {/* {projects.length === 0 ? (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              name={project.name}
              desc={project.description}
              owner={project.owner}
              startDate={project.startDate}
              endDate={project.endDate}
              status={project.status}
              members={project.members}
              pendingMembers={project.pendingMembers}
              // priority={project.priority}
              // progress={project.progress}
            ></ProjectCard>
          ))}
        </div>
      )} */}

      <CommonModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? "Update" : "Add" + "Project"}
      >
        <ProjectForm
          initialValues={editingProject}
          setShowModal={setShowModal}
        />
      </CommonModal>
    </>
  );
};

export default Project;
