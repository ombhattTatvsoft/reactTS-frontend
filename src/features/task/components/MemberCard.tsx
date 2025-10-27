import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { backendUrl } from "../../../common/api/baseApi";
import type { projectRole } from "../../project/projectSlice";
import { getUserData } from "../../../utils/manageUserData";
import DefaultAvatar from "../../profile/components/DefaultAvatar";

interface MemberCardProps {
  member: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  currentProjectRole: projectRole;
  taskCount: number;
  onFilter: (id: string | null) => void;
  isFiltered: boolean;
}

export default function MemberCard({
  member,
  taskCount,
  onFilter,
  isFiltered,
  currentProjectRole,
}: MemberCardProps) {
  const [expanded, setExpanded] = useState(false);
  const userId = getUserData()._id;
  return (
    <motion.div
      layout
      className={`p-3 transition-all duration-300 border lg:w-full   ${
        isFiltered ? "border-indigo-500 rounded-2xl" : "border-transparent"
      } 
      ${
        expanded ? "bg-gray-50 rounded-2xl mb-1" : ""
      }
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center space-x-3">
        {member.avatar ? (
          <img
            src={backendUrl + member.avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-4 border-purple-200"
          />
        ) : (
          <DefaultAvatar name={member.name} className="w-12 h-12 font-medium" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-nowrap">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.role}</p>
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 text-sm text-gray-600"
          >
            <p>
              <span className="font-medium">Email:</span> {member.email}
            </p>
            {(member.role !== "owner" && (currentProjectRole==='owner' || currentProjectRole==='manager' || member._id===userId)) && (
              <>
                <p>
                  <span className="font-medium">Tasks:</span> {taskCount}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilter(isFiltered ? null : member._id);
                  }}
                  className={`mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg font-medium transition-all ${
                    isFiltered
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                >
                  <Filter size={16} />
                  {isFiltered ? "Clear Filter" : "Filter Tasks"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
