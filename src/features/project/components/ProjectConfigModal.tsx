import { Settings } from "lucide-react";
import { useState } from "react";
import CommonModal from "../../../common/components/UI/Modal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
import { Checkbox, Divider, IconButton, Paper, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { updateTaskStages, type TaskStage, type TaskStagesPayload } from "../projectSlice";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import FormButton from "../../../common/components/UI/FormButton";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { CSS } from "@dnd-kit/utilities";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ProjectConfigModal = () => {
    const [openModal, setOpenModal] = useState(false);
    const [tab, setTab] = useState(1);
    const dailogHead = (<>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Project"></Tab>
            <Tab label="Task"></Tab>
        </Tabs>
        <Divider />
    </>);
    return (
        <>
            <Settings size={20} className="text-gray-600" onClick={() => setOpenModal(true)} />
            <CommonModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Project Configuration"
                dailogHead={dailogHead}
            >
                {tab === 1 && <TaskConfiguration />}
                {tab === 0 && (
                    <Typography color="text.secondary">
                        Project config goes here
                    </Typography>
                )}
            </CommonModal>
        </>
    )
}

const TaskConfiguration = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projectConfig } = useSelector(
        (state: RootState) => state.project
    );
    const taskStatuses = projectConfig!.TaskStages.slice().sort((a, b) => a.order - b.order);
    const [statuses, setStatuses] = useState<TaskStage[]>(taskStatuses);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const addStatus = () => {
        setStatuses((prev) => [
            ...prev.slice(0, prev.length - 1),
            {
                name: "New Status",
                order: prev.length,
                isActive: true,
                isEditable: true,
                _id: crypto.randomUUID(),
            },
            { ...prev[prev.length - 1], order: prev.length + 1 }
        ]);
    };
    const taskStatusesPayload: TaskStagesPayload = {
        projectId: projectConfig!.projectId,
        TaskStages: statuses,
    }
    return (
        <>
            <div>
                <p className="">Status</p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={statuses.map(s => s._id)} strategy={verticalListSortingStrategy}>
                        {statuses.map(status => <SortableStatusRow key={status._id} status={status} setStatuses={setStatuses} />)}
                    </SortableContext>
                </DndContext>
                <div className="flex justify-end gap-3 mt-4">
                    <FormButton label="Add Status" name="addStatus" type="button" onClick={addStatus} />
                    <FormButton label="Save" name="savebtn" type="button" onClick={async () => await dispatch(updateTaskStages(taskStatusesPayload))} />
                </div>
            </div>

        </>
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setStatuses((prev) => {
            const oldIndex = prev.findIndex((s) => s._id === active.id);
            const newIndex = prev.findIndex((s) => s._id === over.id);
            return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({
                ...s,
                order: i + 1,
            }));
        });
    }
}

function SortableStatusRow({
    status,
    setStatuses,
}: {
    status: TaskStage;
    setStatuses: React.Dispatch<React.SetStateAction<TaskStage[]>>;
}) {
    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({ id: status._id });

    return (
        <Paper
            ref={status.isEditable ? setNodeRef : null}
            sx={{
                px: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            variant="outlined"
        >
            <DragIndicatorIcon
                fontSize="small"
                sx={{ cursor: `${status.isEditable ? 'grab' : ''}`, color: "text.secondary" }}
                {...attributes}
                {...listeners}
            />

            <TextField
                size="small"
                disabled={!status.isEditable}
                value={status.name}
                onChange={(e) =>
                    setStatuses((prev) =>
                        prev.map((s) =>
                            s._id === status._id ? { ...s, name: e.target.value } : s
                        )
                    )
                }
                sx={{ flex: 1 }}
            />

            <Tooltip title={status.isActive ? "Deactivate Status" : "Activate Status"}>
                <Checkbox
                    checked={status.isActive}
                    disabled={!status.isEditable}
                    onChange={() =>
                        setStatuses((prev) =>
                            prev.map((s) =>
                                s._id === status._id ? { ...s, isActive: !s.isActive } : s
                            )
                        )
                    }
                />
            </Tooltip>

            <Tooltip title="Delete Status">
            <IconButton
                size="small"
                disabled={!status.isEditable}
                onClick={() =>
                    setStatuses((prev) =>
                        prev.filter((s) => s._id !== status._id)
                    )
                }
            >
                <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            </Tooltip>
        </Paper>
    );
}
export default ProjectConfigModal;