import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type AppDispatch, type RootState } from "../../../app/store";
import {
  createButton,
  createInputField,
  createReactNode,
} from "../../../common/utils/FormFieldGenerator";
import FormikForm from "./../../../common/components/UI/FormikForm";
import { SignupSchema } from "../authSchema";
import OAuthButton from "../../../common/components/UI/OAuthButton";
import GoogleIcon from "../../../assets/icons/GoogleIcon";
import { AUTH_ENDPOINTS } from "../../../constants/endPoint";
import { SignupUser } from "../authSlice";

export default function SignUp() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (isAuthenticated) return <Navigate to="/" />;

  const googleLogin = () => {
    window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
  };

  const formFields = [
    createInputField({ type: "email", name: "email", label: "Email" }),
    createInputField({ name: "password", label: "Password", isPassword: true }),
    createInputField({ name: "confirmpassword", label: "Confirm Password", isPassword: true }),
    createReactNode(
      <div className="flex justify-start mb-2">
        <a href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</a>
      </div>
    ),
    createButton({ name: "signup", type: "submit", label: "SignUp", className: "w-full", variant: "contained"}),
    createReactNode(
      <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
    ),
    createReactNode(
      <OAuthButton onClick={googleLogin} label="Google" icon={<GoogleIcon/>} />
    )
  ];
  return (
    <>
      <FormikForm
        initialValues={{ email: "", password: "",confirmpassword:"" }}
        validationSchema={SignupSchema}
        fields={formFields}
        saveAction={(values) => {
          dispatch(SignupUser(values));
        }}
      ></FormikForm>
    </>
  );
}
