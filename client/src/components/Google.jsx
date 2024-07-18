import { useState } from "react";
import { Card, Typography, IconButton, Button } from "@material-tailwind/react";
import ValidatedInput from "../components/ValidatedInput";
import validator from "validator";
import { FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

export default function Google({ onNext }) {
  const [contactInfo, setContactInfo] = useState({
    contactName: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    contactName: "",
    email: "",
    oauth: "",
  });

  const handleChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const newErrors = {};

    if (
      !validator.isLength(contactInfo.contactName, { min: 4 }) ||
      !validator.isAlpha(contactInfo.contactName.replace(/\s/g, ""))
    ) {
      newErrors.contactName = "Valid Contact name  is required";
    }

    if (!validator.isEmail(contactInfo.email)) {
      newErrors.email = "Valid email address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    /*try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            
        } catch (err) {
            console.log(error);
        }*/

    setErrors({});
    setIsLoading(false);
    onNext(contactInfo);
  };

  const handleGoogleClick = async () => {
    try {
      setIsLoading(true);

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      const displayName = result.user.displayName;
      const uid = result.user.uid;
      const token = await result.user.getIdToken();

      console.log(email);
      console.log(displayName);

      setContactInfo((prevContactInfo) => {
        const updatedContactInfo = {
          ...prevContactInfo,
          contactName: displayName,
          email: email,
        };
        onNext(updatedContactInfo);
        return updatedContactInfo;
      });

      setErrors({});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const newErrors = {};

      switch (error.code) {
        case "auth/popup-closed-by-user":
          newErrors.oauth =
            "The popup was closed before completing the sign-in. Please try again.";
          break;
        case "auth/internal-error":
          newErrors.oauth =
            "An internal error occurred. Please try again later.";
          break;
        default:
          newErrors.oauth = error.message;
          break;
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      console.log(error.message);
    }
  };

  return (
    <Card className="mx-auto max-w-xl" color="transparent" shadow={false}>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96"
      >
        <Typography
          className="text-center mb-4 text-blue-gray-600"
          variant="h3"
          color="blue-gray"
        >
          Sign up
        </Typography>

        <ValidatedInput
          label="Contact Person's Name"
          placeholder="Abebe Bekele"
          value={contactInfo.contactName}
          onChange={(e) => handleChange("contactName", e.target.value)}
          error={errors.contactName}
          required
        />

        <ValidatedInput
          label="Email Address"
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <Button
          size="lg"
          variant="outlined"
          color="blue-gray"
          loading={isLoading}
          className={`flex items-center gap-3 justify-center`}
          onClick={handleGoogleClick}
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </Button>

        {errors.oauth && (
          <Typography variant="small" color="red" className="text-center">
            {errors.oauth}
          </Typography>
        )}

        <div className="flex justify-end mt-8">
          <IconButton type="submit" loading={isLoading}>
            <FaArrowRight />
          </IconButton>
        </div>
      </form>
    </Card>
  );
}
