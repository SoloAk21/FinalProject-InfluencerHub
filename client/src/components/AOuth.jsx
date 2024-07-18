import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { Button, Typography } from "@material-tailwind/react";
import { signInSuccess } from "../redux/user/userSlice";
import { useState } from "react";
import { emailAuthSuccess } from "../redux/user/emailSlice";
import { postToAuthAPI } from "../helper/postToAuthAPI";
import axios from "axios";

export default function OAuth({ className }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrors] = useState(null);

  const handleGoogleClick = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      console.log(email);

      const response = await axios.post("/api/auth/googleAuth", { email });

      if (response.status !== 200) {
        throw new Error("Network response was not ok.");
      }

      const data = response.data;

      dispatch(signInSuccess(data));
      setIsLoading(false);
      navigate("/search");
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors(error.response.data.message);
      }
    }
  };

  return (
    <div>
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
      {error && (
        <Typography color="red" className="text-[10px] ml-2 ">
          {error}
        </Typography>
      )}
    </div>
  );
}
