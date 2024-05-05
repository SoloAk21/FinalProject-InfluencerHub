import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { Button } from "@material-tailwind/react";
import { signInSuccess, signOutSuccess } from "../redux/user/userSlice";
import { useState } from "react";
import { emailAuthSuccess } from "../redux/user/emailSlice";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrors] = useState(null);
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      const user = auth.currentUser;
      if (user) {
        await user.delete();
      }

      const response = await fetch("/api/company-auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();

      // Assuming you have defined setIsLoading and setErrors
      setIsLoading(false);

      if (data.userExists === false) {
        dispatch(emailAuthSuccess(email));
        setErrors(null);
        navigate("/brand/signup");
        return;
      }
      dispatch(signInSuccess(data));
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
      className="flex items-center gap-3 m-auto"
      onClick={handleGoogleClick}
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </Button>
  );
}
