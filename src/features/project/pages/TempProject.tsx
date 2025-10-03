import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  Calendar,
  Users,
  DollarSign,
  Target,
  Clock,
  AlertCircle,
} from "lucide-react";
import FormButton from "../../../common/components/UI/FormButton";

const ProjectModule = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      manager: "John Doe",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      budget: 50000,
      status: "In Progress",
      priority: "High",
      category: "Development",
      completion: 45,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for customer portal",
      manager: "Jane Smith",
      startDate: "2025-02-01",
      endDate: "2025-08-15",
      budget: 75000,
      status: "Planning",
      priority: "High",
      category: "Development",
      completion: 15,
    },
    {
      id: 3,
      name: "Marketing Campaign Q2",
      description: "Social media and email marketing campaign",
      manager: "Mike Johnson",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      budget: 25000,
      status: "Not Started",
      priority: "Medium",
      category: "Marketing",
      completion: 0,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "Not Started",
    priority: "Medium",
    category: "",
    completion: 0,
  });

  const statusColors = {
    "Not Started": "bg-gray-100 text-gray-700",
    Planning: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "On Hold": "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const priorityColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.manager ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.budget ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...formData, id: p.id } : p
        )
      );
    } else {
      setProjects([...projects, { ...formData, id: Date.now() }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager: "",
      startDate: "",
      endDate: "",
      budget: "",
      status: "Not Started",
      priority: "Medium",
      category: "",
      completion: 0,
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    // <main className="flex-grow flex items-center justify-center">
    //     <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Welcome to TaskApp</h1>
    //   </main>
    <div className="flex-grow p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Manage and track all your projects</p>
          </div>
          <FormButton type="button" name="addProject" variant="contained" label="New Project"
            onClick={() => setShowModal(true)} className="transform hover:-translate-y-0.5"
            startIcon={<Plus size={20} />}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
            }}
          ></FormButton>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white min-w-[180px]"
            >
              <option>All</option>
              <option>Not Started</option>
              <option>Planning</option>
              <option>In Progress</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <Target className="text-indigo-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {projects.filter((p) => p.status === "In Progress").length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.status === "Completed").length}
                </p>
              </div>
              <AlertCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-indigo-600">
                  $
                  {projects
                    .reduce((sum, p) => sum + Number(p.budget), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-indigo-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-700">{project.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-700">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-gray-700">
                      ${Number(project.budget).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      priorityColors[project.priority]
                    }`}
                  >
                    {project.priority}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{project.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProject ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Manager *
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Manager name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Not Started</option>
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion (%) *
                  </label>
                  <input
                    type="number"
                    name="completion"
                    value={formData.completion}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectModule;
