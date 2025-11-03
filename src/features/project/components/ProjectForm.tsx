import { useDispatch } from "react-redux";
import FormikForm from "../../../common/components/UI/FormikForm";
import {
  createButton,
  createDatePicker,
  createInputField,
  createReactNode,
  createSelectDropdown,
} from "../../../common/utils/FormFieldGenerator";
import { ProjectSchema, type ProjectPayload } from "../projectSchema";
import type { AppDispatch } from "../../../app/store";
import { createProject, editProject, getProjects } from "../projectSlice";
import { MemberFields } from "./AddMember";
import { useCallback, useMemo } from "react";
import { startOfToday } from "date-fns";
import FormRichTextEditor from "../../../common/components/UI/FormRichTextEditor";

interface ProjectFormProps {
  initialValues: ProjectPayload | null;
  setShowModal: (value: boolean) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  setShowModal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const today = startOfToday();
  const isUpdate = Boolean(initialValues);
  const newInitialValues = useMemo(
    () => ({
      _id: initialValues?._id,
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      startDate: initialValues?.startDate ?? null,
      endDate: initialValues?.endDate ?? null,
      status: initialValues?.status || "pending",
      members: initialValues?.members || [],
    }),
    [initialValues]
  );

  const formFields = useMemo(
    () => [
      createInputField({
        name: "name",
        label: "Project Name",
        type: "text",
        containerclassname: "w-1/2 px-2",
      }),
      createSelectDropdown({
        name: "status",
        label: "Status",
        options: [
          { value: "pending", label: "Pending" },
          { value: "in-progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
        ],
        containerclassname: "w-1/2 px-2",
      }),
      createDatePicker({
        name: "startDate",
        label: "Start Date",
        containerclassname: "w-1/2 px-2",
        disablePast: !isUpdate,
        maxDatefunc: (values) => values.endDate,
      }),
      createDatePicker({
        name: "endDate",
        label: "End Date",
        containerclassname: "w-1/2 px-2",
        minDatefunc: (values) => values.startDate || today,
      }),
      createReactNode(<FormRichTextEditor name="description" label="Description"/>),
      createReactNode(<MemberFields></MemberFields>),
      createButton({
        name: "submit",
        type: "submit",
        label: initialValues ? "Update Project" : "Create Project",
        variant: "contained",
        sx: { paddingX: 2, paddingY: 1 },
        containerclassname: "px-2 w-full flex align-center justify-end",
      }),
    ],
    [initialValues, isUpdate, today]
  );

  const handleAdd = useCallback(
    async (values: ProjectPayload) => {
      await dispatch(createProject(values))
        .unwrap()
        .then(async () => await dispatch(getProjects()));
      setShowModal(false);
    },
    [dispatch, setShowModal]
  );

  const handleEdit = useCallback(
    async (values: ProjectPayload) => {
      await dispatch(editProject(values))
        .unwrap()
        .then(async () => await dispatch(getProjects()));
      setShowModal(false);
    },
    [dispatch, setShowModal]
  );

  return (
    <FormikForm
      initialValues={newInitialValues}
      validationSchema={ProjectSchema(isUpdate)}
      saveAction={initialValues ? handleEdit : handleAdd}
      fields={formFields}
    />
  );
};

export default ProjectForm;
