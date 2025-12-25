import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { User as UserIcon, Lock, Camera, Save, X } from "lucide-react";
import Card from "../../../common/components/UI/Card";
import FormButton from "../../../common/components/UI/FormButton";
import FormInput from "../../../common/components/UI/FormInput";
import { getUserData, setUserData } from "../../../utils/manageUserData";
import {
  createButton,
  createInputField,
  type FormField,
} from "../../../common/utils/FormFieldGenerator";
import {
  ChangePasswordSchema,
  type ChangePasswordPayload,
} from "../../auth/authSchema";
import type { AppDispatch } from "../../../app/store";
import FormikForm from "../../../common/components/UI/FormikForm";
import { updateUserPassword, updateUserProfile } from "../../auth/authSlice";
import { backendUrl } from "../../../common/api/baseApi";
import DefaultAvatar from '../../../common/components/UI/DefaultAvatar';
import { formatDate } from "../../../utils/dateTime.util";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = getUserData();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const initialEditForm = useMemo(
    () => ({
      name: userData?.name || "",
      avatar: userData?.avatar || "",
    }),
    [userData]
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState(initialEditForm);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      if (avatarFile) formData.append("avatar", avatarFile);

      await dispatch(updateUserProfile(formData)).unwrap();

      setUserData({
        ...userData,
        name: editForm.name,
        avatar: editForm.avatar,
      });

      setIsEditingProfile(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handlePasswordChange = async (values: ChangePasswordPayload) => {
    await dispatch(updateUserPassword(values)).unwrap();
  };

  const cancelEdit = () => {
    setEditForm(initialEditForm);
    setIsEditingProfile(false);
    setAvatarFile(null);
  };

  const passwordFields: FormField[] = [
    createInputField({
      type: "text",
      name: "currentPassword",
      label: "Current Password",
      isPassword: true,
    }),
    createInputField({
      type: "text",
      name: "newPassword",
      label: "New Password",
      isPassword: true,
    }),
    createInputField({
      type: "text",
      name: "confirmPassword",
      label: "Confirm New Password",
      isPassword: true,
    }),
    createButton({
      type: "submit",
      label: "Update Password",
      name: "updatePassword",
      className: "w-full",
      startIcon: <Save className="w-4 h-4" />,
      sx: { paddingY: 1.5 },
    }),
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                {editForm.avatar || userData.avatar ? (
                  <img
                    src={
                      editForm.avatar
                        ? editForm.avatar.startsWith("data:")
                          ? editForm.avatar
                          : backendUrl + editForm.avatar
                        : backendUrl + userData.avatar
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                  />
                ) : (
                  <DefaultAvatar name={editForm.name} className="w-32 h-32 text-4xl font-bold border-4"/>
                )}

                {isEditingProfile && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {userData.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{userData.email}</p>
              <p className="text-xs text-gray-500 mb-6">
                Member since {formatDate(userData.createdAt!)}
              </p>

              {!isEditingProfile && (
                <FormButton
                  onClick={() => setIsEditingProfile(true)}
                  type="button"
                  label="Edit Profile"
                  name="editBtn"
                  className="w-full"
                  sx={{ paddingY: 1, marginBottom: 1 }}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <Card className="bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h3>
              </div>
              {isEditingProfile && (
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-5">
              <FormInput
                type="text"
                name="name"
                label="Full Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={!isEditingProfile}
              />
              <FormInput
                type="email"
                name="email"
                label="Email Address"
                value={userData.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed
              </p>

              {isEditingProfile && (
                <div className="flex gap-3">
                  <FormButton
                    type="button"
                    name="updateProfile"
                    label="Save Changes"
                    onClick={handleProfileUpdate}
                    startIcon={<Save className="w-4 h-4" />}
                    className="w-full"
                    sx={{ fontWeight: 600 }}
                  />
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Security Section */}
          <Card className="bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Security</h3>
            </div>

            {/* Formik Password Form */}
            <FormikForm<ChangePasswordPayload>
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={ChangePasswordSchema}
              saveAction={handlePasswordChange}
              fields={passwordFields}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
