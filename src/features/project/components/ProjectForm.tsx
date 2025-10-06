import { useDispatch } from "react-redux";
import FormikForm from "../../../common/components/UI/FormikForm";
import {
  createButton,
  createDatePicker,
  createInputField,
  createReactNode,
  createSelectDropdown,
  createTextArea,
} from "../../../common/utils/FormFieldGenerator";
import { createProjectSchema, type ProjectPayload } from "../projectSchema";
import type { AppDispatch } from "../../../app/store"; 
import { createProject, getProjects } from "../projectSlice";
import { startOfToday, addMonths } from "date-fns";
import { MemberFields } from "./AddMember";

interface ProjectFormProps {
  initialValues: ProjectPayload | null;
  setShowModal: (value : boolean) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues,setShowModal }) => {
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
    createReactNode(<MemberFields></MemberFields>),
    createButton({
      name: "submit",
      type: "submit",
      label: initialValues ? "Update Project" : "Create Project",
      variant: "contained",
      sx:{paddingX:2,paddingY:1},
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
      saveAction={ async (values) => {await dispatch(createProject(values)).unwrap().then(() => dispatch(getProjects()));
        setShowModal(false);
       }}
      fields={formFields}
    />
  );
};

export default ProjectForm;
