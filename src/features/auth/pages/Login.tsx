import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type AppDispatch, type RootState } from "../../../app/store";
import {
  createButton,
  createCheckBox,
  createInputField,
  createReactNode,
} from "../../../common/utils/FormFieldGenerator";
import FormikForm from "../../../common/components/UI/FormikForm";
import { loginSchema } from "../authSchema";
import { loginUser } from "../authSlice";
import OAuthButton from "../../../common/components/UI/OAuthButton";
import GoogleIcon from "../../../assets/icons/GoogleIcon";
import { AUTH_ENDPOINTS } from "../../../constants/endPoint";
import WelcomeLogo from './../components/WelcomeLogo';
import LoginDivider from "../components/LoginDivider";
import { Link } from "@mui/material";

export default function Login() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (isAuthenticated) return <Navigate to="/" />;

  const googleLogin = () => {
    window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
  };

  const formFields = [
    createInputField({ type: "email", name: "email", label: "Email", }),
    createInputField({ name: "password", label: "Password", isPassword: true }),
    createCheckBox({ name: "remember", label: "Remember me" }),
    createButton({
      name: "login",
      type: "submit",
      label: "Login",
      className: "w-full",
      variant: "contained",
      sx: { py: 1.5, fontSize: "1rem", fontWeight: 600 },
    }),
    createReactNode(
      <LoginDivider />
    ),
    createReactNode(
      <OAuthButton onClick={googleLogin} label="Google" icon={<GoogleIcon />} sx={{py:1.5, fontSize: "1rem", fontWeight: 600 }}/>
    ),
    createReactNode(
      <div className="text-center mt-3">
        <p className="text-gray-500 text-md">
          Don't have an account?
          <Link
            href="/signup"
            underline="hover"
            sx={{
              color: "#7c3aed",
              fontWeight: 500,
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    ),
  ];
  return (
    <>
      <WelcomeLogo mode="signin"/>
      <FormikForm
        initialValues={{ email: "", password: "", remember: false }}
        validationSchema={loginSchema}
        fields={formFields}
        saveAction={async (values) => {
          await dispatch(loginUser(values)).unwrap();
        }}
      ></FormikForm>
    </>
  );
}
