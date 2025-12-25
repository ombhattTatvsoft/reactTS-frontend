import { useDispatch } from "react-redux";
import { TaskSchema, type TaskPayload } from "../taskSchema";
import type { AppDispatch } from "../../../app/store";
import { useCallback, useMemo } from "react";
import {
  createButton,
  createDatePicker,
  createInputField,
  createReactNode,
  createSelectDropdown,
} from "../../../common/utils/FormFieldGenerator";
import FormikForm from "../../../common/components/UI/FormikForm";
import { createTask, editTask, getTasks, type Task } from "../taskSlice";
import { getUserData } from "../../../utils/manageUserData";
import AttachmentUploaderFormikWrapper from "./AttachmentUploaderFormik";
import FormRichTextEditor from "../../../common/components/UI/FormRichTextEditor";
import type { Project, ProjectConfigResponse } from "../../project/projectSlice";

interface TaskFormProps {
  initialValues: TaskPayload | null;
  setShowModal: (value: boolean) => void;
  projectId: string;
  allMembers: {members: Project['members'], pendingMembers: Project['pendingMembers']};
  projectConfig: ProjectConfigResponse['projectConfig'];
}
const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  setShowModal,
  projectId,
  allMembers,
  projectConfig,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = getUserData()._id;
  const isUpdate = Boolean(initialValues);

  const statusOptions = useMemo(() => projectConfig?.TaskStages.filter(t => t.isActive).sort((a,b) => a.order - b.order).map(stage => ({ label: stage.name, value: stage._id })) || [],[projectConfig?.TaskStages]);

  const newInitialValues = useMemo(
    () => ({
      _id: initialValues?._id,
      projectId,
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "0",
      priority: initialValues?.priority || ("medium" as Task["priority"]),
      assignee: initialValues?.assignee || "",
      dueDate: initialValues?.dueDate || null,
      tags: initialValues?.tags || "",
      attachments: initialValues?.attachments || [],
      deletedFilenames: [] as string[],
    }),
    [initialValues, projectId]
  );

  const formFields = useMemo(
    () => [
      createInputField({
        name: "title",
        label: "Task Title",
        type: "text",
        containerclassname: "w-1/2 px-2",
      }),
      createSelectDropdown({
        name: "assignee",
        label: "Assignee",
        options: allMembers.members
          .filter((m) => m.role !== "owner" && m.user._id !== currentUserId)
          .map((m) => ({
            value: m.user._id,
            label: `${m.user.name} (${m.role})`,
          }))
          .concat(
            allMembers.pendingMembers.map((m) => ({
              value: m._id,
              label: `${m.email} (${m.role}) Pending`,
              muiProps: { disabled: true },
            }))
          ),
        containerclassname: "w-1/2 px-2",
      }),
      createSelectDropdown({
        name: "status",
        label: "Status",
        options: statusOptions,
        containerclassname: "w-1/2 px-2",
      }),
      createSelectDropdown({
        name: "priority",
        label: "Priority",
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ],
        containerclassname: "w-1/2 px-2",
      }),
      createDatePicker({
        name: "dueDate",
        label: "Due Date",
        containerclassname: "w-1/2 px-2",
        disablePast: !isUpdate,
      }),
      createInputField({
        name: "tags",
        label: "Tags (comma separated)",
        type: "text",
        containerclassname: "w-1/2 px-2",
      }),
      createReactNode(
        <div className="mb-4">
          <AttachmentUploaderFormikWrapper
          name="attachments"
          deletedFieldName="deletedFilenames"
          accept="image/*,.pdf,.doc,.docx"
          maxFiles={5}
          maxSizeInMB={5}
        />
        </div>
      ),
      createReactNode(<FormRichTextEditor name="description" placeholder="Provide details" label="Description"/>),
      createButton({
        name: "submit",
        type: "submit",
        label: isUpdate ? "Update Task" : "Create Task",
        variant: "contained",
        sx: { paddingX: 2, paddingY: 1 },
        containerclassname: "px-2 w-full flex align-center justify-end",
      }),
    ],
    [allMembers.members, allMembers.pendingMembers, currentUserId, isUpdate, statusOptions]
  );

  const handleAdd = useCallback(
    async (values: TaskPayload) => {
      await dispatch(createTask(values))
        .unwrap()
        .then(async () => {
          await dispatch(getTasks(projectId));
        });
      setShowModal(false);
    },
    [dispatch, projectId, setShowModal]
  );

  const handleEdit = useCallback(
    async (values: TaskPayload) => {
      await dispatch(editTask(values))
        .unwrap()
        .then(async () => {
          await dispatch(getTasks(projectId));
        });
      setShowModal(false);
    },
    [dispatch, projectId, setShowModal]
  );
  return (
    <FormikForm
      initialValues={newInitialValues}
      validationSchema={TaskSchema(isUpdate)}
      saveAction={isUpdate ? handleEdit : handleAdd}
      fields={formFields}
    />
  );
};

export default TaskForm;
