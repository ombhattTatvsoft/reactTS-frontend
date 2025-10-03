import { useDispatch } from "react-redux";
import FormikForm from "../../../common/components/UI/FormikForm";
import {
  createButton,
  createDatePicker,
  createInputField,
  createSelectDropdown,
  createTextArea,
} from "../../../common/utils/FormFieldGenerator";
import { createProjectSchema, type ProjectPayload } from "../projectSchema";
import type { AppDispatch } from "../../../app/store"; 
import { createProject } from "../projectSlice";
import { startOfToday, addMonths } from "date-fns";

interface ProjectFormProps {
  initialValues: ProjectPayload | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues }) => {
    const dispatch = useDispatch<AppDispatch>();
  
  const formFields = [
    createInputField({ name: "name", label: "Project Name", type: "text", containerclassname:"w-1/2 px-2"}),
    createSelectDropdown({
      name: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
      containerclassname:"w-1/2 px-2"
    }),
    createDatePicker({ name: "startDate", label: "Start Date", containerclassname:"w-1/2 px-2", minDate:new Date() }),
    createDatePicker({ name: "endDate", label: "End Date", containerclassname:"w-1/2 px-2", minDate:new Date() }),
    createTextArea({ name: "description", label: "Description", containerclassname:"w-full px-2"}),
    // createSelectDropdown({
    //   name: "priority",
    //   label: "Priority",
    //   options: [
    //     { value: "low", label: "Low" },
    //     { value: "medium", label: "Medium" },
    //     { value: "high", label: "High" },
    //   ],
    // }),
    createButton({
      name: "submit",
      type: "submit",
      label: initialValues ? "Update Project" : "Create Project",
      variant: "contained",
      containerclassname:"px-2 w-full flex align-center justify-end",
    }),
  ];

  const today = startOfToday();
  const oneMonthLater = addMonths(today,1);

  const newIntialValues = {
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    startDate: initialValues?.startDate??today,
    endDate: initialValues?.endDate??oneMonthLater,
    status: initialValues?.status || "pending",
    // priority: initialValues?.priority??"medium",
    members: initialValues?.members || [],
  };
  return (
    <FormikForm
      initialValues={newIntialValues}
      validationSchema={createProjectSchema}
      saveAction={async (values) => {await dispatch(createProject(values)).unwrap()}}
      fields={formFields}
    />
  );
};

export default ProjectForm;
