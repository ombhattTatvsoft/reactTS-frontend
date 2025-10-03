import { Divider, Typography } from "@mui/material";

const LoginDivider = () => {
  return (
    <Divider sx={{ marginY: 2 }}>
      <Typography variant="body2" sx={{ color: "#9ca3af", px: 2 }}>
        Or continue with
      </Typography>
    </Divider>
  );
};

export default LoginDivider;
