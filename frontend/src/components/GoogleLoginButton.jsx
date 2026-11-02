import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      );

      // Adapt these lines to your existing auth/context structure
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/";
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.error("Google Sign-In failed")}
    />
  );
};

export default GoogleLoginButton;