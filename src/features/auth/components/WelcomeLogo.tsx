type WelcomeLogoProps = {
  mode: "signin" | "signup";
};
const WelcomeLogo = ({ mode }: WelcomeLogoProps) => {
  const isSignIn = mode === "signin";
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg inline-flex items-center justify-center mb-2">
        <span className="text-white font-bold text-2xl">T</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome {isSignIn ? "Back" : ""}
      </h1>
      <p className="text-sm text-gray-500">
        {isSignIn ? "Sign in" : "Sign up"} to continue to TaskApp
      </p>
    </div>
  );
};

export default WelcomeLogo;
