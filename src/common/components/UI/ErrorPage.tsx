import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Ban, Search, Server, Home } from "lucide-react";

const errorMessages: Record<string, { title: string; message: string }> = {
  "403": {
    title: "Forbidden",
    message: "You don't have permission to view this resource.",
  },
  "404": {
    title: "Not Found",
    message: "The page you’re looking for doesn’t exist.",
  },
  "500": {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
  },
};

const ErrorPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const error = errorMessages[code ?? "404"] || {
    icon: AlertTriangle,
    title: "Error",
    message: "An unexpected error occurred.",
  };
  const errorIcons = {
    "403": Ban,
    "404": Search,
    "500": Server,
  }
  const Icon = errorIcons[code as keyof typeof errorIcons] || AlertTriangle;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md">
        <Icon size={64} className="mx-auto text-indigo-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {error.title} ({code})
        </h1>
        <div className="mb-6">
        <p className="text-gray-600">{error.message}</p>
        </div>
        <div className="flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Home size={18} /> Go Home
        </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
