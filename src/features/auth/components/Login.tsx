import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type AppDispatch, type RootState } from "../../../app/store";
import {
  createButton,
  createCheckBox,
  createInputField,
  createReactNode,
} from "../../../common/utils/FormFieldGenerator";
import FormikForm from "./../../../common/components/UI/FormikForm";
import { loginSchema } from "../authSchema";
import { loginUser } from "../authSlice";
import OAuthButton from "../../../common/components/UI/OAuthButton";
import GoogleIcon from "../../../assets/icons/GoogleIcon";
import { AUTH_ENDPOINTS } from "../../../constants/endPoint";
import { Box, Link, Typography,Divider } from "@mui/material";

export default function Login() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (isAuthenticated) return <Navigate to="/" />;

  const googleLogin = () => {
    window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
  };

  const formFields = [
    createInputField({ type: "email", name: "email", label: "Email" }),
    createInputField({ name: "password", label: "Password", isPassword: true }),
    createCheckBox({ name: "remember", label: "Remember me" }),
    createReactNode(
      <Link
        href="/signup"
        underline="hover"
        sx={{
          fontSize: "0.875rem",
          color: "#7c3aed",
          fontWeight: 500,
        }}
      >
        Don't have an account? Sign Up
      </Link>
    ),
    createButton({
      name: "login",
      type: "submit",
      label: "Login",
      className: "w-full",
      variant: "contained",
    }),
    createReactNode(
      <Divider sx={{marginY:2}}>
              <Typography variant="body2" sx={{ color: '#9ca3af', px: 2 }}>
                Or continue with
              </Typography>
            </Divider>
    ),
    createReactNode(
      <OAuthButton onClick={googleLogin} label="Google" icon={<GoogleIcon />} />
    ),
  ];
  return (
    <>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: "bold",
              color: "white",
            }}
          >
            T
          </Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
          }}
        >
          Sign in to continue to TaskApp
        </Typography>
      </Box>
      <FormikForm
        initialValues={{ email: "", password: "", remember: false }}
        validationSchema={loginSchema}
        fields={formFields}
        saveAction={(values) => {
          dispatch(loginUser(values));
        }}
      ></FormikForm>
    </>
  );
}
