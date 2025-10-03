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
import WelcomeLogo from "./../components/WelcomeLogo";
import LoginDivider from "../components/LoginDivider";
import { Link } from "@mui/material";

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
    createInputField({name: "confirmpassword", label: "Confirm Password", isPassword: true }),
    createButton({
      name: "signup",
      type: "submit",
      label: "SignUp",
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
          Already have an account?
          <Link
            href="/login"
            underline="hover"
            sx={{
              color: "#7c3aed",
              fontWeight: 500,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    )
  ];
  return (
    <>
      <WelcomeLogo mode="signup" />
      <FormikForm
        initialValues={{ email: "", password: "", confirmpassword: "" }}
        validationSchema={SignupSchema}
        fields={formFields}
        saveAction={async (values) => {
          await dispatch(SignupUser(values)).unwrap();
        }}
      ></FormikForm>
    </>
  );
}
