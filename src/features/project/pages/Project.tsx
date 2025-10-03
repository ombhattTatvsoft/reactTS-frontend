import { useState } from "react";
import { Plus, Target } from "lucide-react";
import FormButton from "../../../common/components/UI/FormButton";
import ProjectCard from "../components/ProjectCard";
import CommonModal from "../../../common/components/UI/Modal";
import ProjectForm from "../components/ProjectForm";
import type { ProjectPayload } from "../projectSchema";

const Project = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectPayload | null>(null);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      manager: "John Doe",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      status: "in-progress",
      priority: "high",
      category: "Development",
      progress: 45,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for customer portal",
      manager: "Jane Smith",
      startDate: "2025-02-01",
      endDate: "2025-08-15",
      status: "completed",
      priority: "medium",
      category: "Development",
      progress: 15,
    },
    {
      id: 3,
      name: "Marketing Campaign Q2",
      description: "Social media and email marketing campaign",
      manager: "Mike Johnson",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      status: "pending",
      priority: "low",
      category: "Marketing",
      progress: 0,
    },
  ]);


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>
        <FormButton
          type="button"
          name="addProject"
          variant="contained"
          label="New Project"
          onClick={() => {setEditingProject(null);setShowModal(true);}}
          className="transform hover:-translate-y-0.5"
          startIcon={<Plus size={20} />}
          sx={{
            px: 3,
            py: 1.5,
            textTransform: "none",
          }}
        ></FormButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            desc={project.description}
            manager={project.manager}
            startDate={project.startDate}
            endDate={project.endDate}
            status={project.status}
            priority={project.priority}
            progress={project.progress}
          ></ProjectCard>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      )}

        <CommonModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject?"Update" : "Add" + "Project"}
        >
        <ProjectForm initialValues={editingProject}/>
        </CommonModal>
    </>
  );
};

export default Project;
