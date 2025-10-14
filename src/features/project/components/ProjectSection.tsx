import { memo } from "react";
import type { Project } from "../projectSlice";
import ProjectCard from "./ProjectCard";

interface ProjectSectionProps {
  title: string;
  projects: Project[];
  isAssigned?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

const ProjectSection = memo(
  ({ title, projects, isAssigned = false, onEdit, onDelete }: ProjectSectionProps) => {
    if (projects.length === 0) return null;

    return (
      <section className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-3">{title} ({projects.length})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              isAssigned={isAssigned}
              project={project}
              onEdit={onEdit ? () => onEdit(project) : undefined}
              onDelete={onDelete ? () => onDelete(project._id) : undefined}
            />
          ))}
        </div>
      </section>
    );
  }
);

export default ProjectSection;
