import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { Button } from "@material-tailwind/react";
import { signInSuccess } from "../redux/user/userSlice";
import { useState } from "react";
import { emailAuthSuccess } from "../redux/user/emailSlice";
import { postToAuthAPI } from "../helper/postToAuthAPI";

export default function OAuth({ userType, className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrors] = useState(null);

  const handleGoogleClick = async () => {
    const API_PATHS = {
      influencer: "/api/auth/influencers/google",
      company: "/api/auth/companies/google",
    };

    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      const apiPath = API_PATHS[userType];

      const response = await postToAuthAPI(apiPath, { email });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();

      console.log(data);
      if (data.userExists === false) {
        dispatch(emailAuthSuccess(email));
        setErrors(null);
        navigate(`/${userType}/signup`);
        return;
      }
      dispatch(signInSuccess(data));
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setErrors(error.message);
      console.log(error.message);
    }
  };

  return (
    <Button
      size="lg"
      variant="outlined"
      color="blue-gray"
      loading={isLoading}
      className={`flex items-center gap-3 m-auto ${className}`}
      onClick={handleGoogleClick}
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </Button>
  );
}
