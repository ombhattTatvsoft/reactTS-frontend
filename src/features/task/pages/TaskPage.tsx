import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../common/components/UI/Loader";

interface Task {
  _id: string;
  title: string;
  description: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  tasks: Task[];
}

const TaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      // ⏳ simulate API delay
      setTimeout(() => {
        // 📦 Dummy project data
        const dummyProject: Project = {
          _id: id,
          name: "Website Redesign Project",
          description:
            "This project involves redesigning the company website to improve UI/UX and SEO.",
          tasks: [
            {
              _id: "t1",
              title: "Design new homepage",
              description: "Create a new, modern homepage layout.",
            },
            {
              _id: "t2",
              title: "Migrate content",
              description: "Move content from old site to the new structure.",
            },
            {
              _id: "t3",
              title: "Set up SEO",
              description: "Optimize meta tags and improve page performance.",
            },
          ],
        };

        setSelectedProject(dummyProject);
        setLoading(false);
      }, 1000); // 1 sec delay
    }
  }, [id]);

  if (loading || !selectedProject) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
      <p className="text-gray-600 mb-6">{selectedProject.description}</p>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
          <ul className="space-y-3">
            {selectedProject.tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="font-medium text-lg">{task.title}</h3>
                <p className="text-gray-500 text-sm">{task.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks yet.</p>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
