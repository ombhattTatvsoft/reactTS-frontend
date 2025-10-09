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
import { createProject, editProject, getProjects } from "../projectSlice";
import { MemberFields } from "./AddMember";
import { useCallback, useMemo } from "react";
import { startOfToday } from "date-fns";

interface ProjectFormProps {
  initialValues: ProjectPayload | null;
  setShowModal: (value : boolean) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues,setShowModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const today = startOfToday();
  const newInitialValues = useMemo(
    () => ({
      _id:initialValues?._id,
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      startDate: initialValues?.startDate??null,
      endDate: initialValues?.endDate??null,
      status: initialValues?.status || "pending",
      members: initialValues?.members || [],
    }),
    [initialValues]
  );

  const formFields = useMemo(() => [
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
    createDatePicker({ name: "startDate", label: "Start Date", containerclassname:"w-1/2 px-2", minDate:today }),
    createDatePicker({ name: "endDate", label: "End Date", containerclassname:"w-1/2 px-2", minDate:today }),
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
  ],[initialValues,today]);

  const handleAdd = useCallback(
    async (values: ProjectPayload) => {
      await dispatch(createProject(values)).unwrap().then(async () => await dispatch(getProjects()));
      setShowModal(false);
    },
    [dispatch, setShowModal]
  );
  
  const handleEdit = useCallback(
    async (values: ProjectPayload) => {
      await dispatch(editProject(values)).unwrap().then(async () => await dispatch(getProjects()));
      setShowModal(false);
    },
    [dispatch, setShowModal]
  );

  return (
    <FormikForm
      initialValues={newInitialValues}
      validationSchema={createProjectSchema}
      saveAction={initialValues ? handleEdit : handleAdd}
      fields={formFields}
    />
  );
};

export default ProjectForm;
