/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Login.tsx (or components/Login.tsx)
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message"; // Add this for error display
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react'; // Add this for error state
import log from '../assets/log.png'
import { LoginDTO } from "../modules"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string>(''); // Add error state
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Add loading state

  // DEV: loosen password rule to allow '123456'
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    // For production, switch back to your strong rule
    password: Yup.string().required('Password is required').min(6, 'Min 6 chars'),
    // password: Yup.string().required('password is required').matches(
    //   /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
    //   'Password must be at least 8 characters long and contain one uppercase letter and one or more symbols'
    // ),
  });

  const loginform = useFormik<LoginDTO>({
    initialValues: new LoginDTO(),
    validateOnChange: true,
    validationSchema,
    onSubmit: async (values) => {
      console.log('Login form submitted with values:', { email: values.email });
      
      // Clear any previous errors
      setLoginError('');
      setIsLoggingIn(true);

      try {
        // Call the login function from AuthContext
        await login({ email: values.email, password: values.password });
        
        console.log('Login successful, navigating to home');
        navigate('/home');
        
      } catch (error: any) {
        console.error('Login failed:', error);
        
        // Set error message for display
        const errorMessage = error.message || 'Login failed. Please try again.';
        setLoginError(errorMessage);
        
        // Reset form if needed
        // loginform.setFieldValue('password', '');
        
      } finally {
        setIsLoggingIn(false);
      }
    },
  });

  return (
    <div className="flex flex-nowrap login-form-container">
      <form className="" onSubmit={loginform.handleSubmit}>
        <div className="login-container">
          <h1 className="font-bold">Themely Login</h1>

          <div className="login-form">
            {/* Display login error if exists */}
            {loginError && (
              <Message 
                severity="error" 
                text={loginError} 
                className="mb-3 w-full"
              />
            )}

            {/* Email Field */}
            <small className="p-error">
              {loginform.touched.email && loginform.errors.email}
            </small>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                placeholder="Email"
                value={loginform.values.email}
                onChange={loginform.handleChange}
                name="email"
                onBlur={loginform.handleBlur}
                disabled={isLoggingIn} // Disable during login
              />
            </div>

            {/* Password Field */}
            <small className="p-error">
              {loginform.touched.password && loginform.errors.password}
            </small>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <InputText
                type="password"
                placeholder="Password"
                name="password"
                value={loginform.values.password}
                onChange={loginform.handleChange}
                onBlur={loginform.handleBlur}
                disabled={isLoggingIn} // Disable during login
              />
            </div>

            {/* Submit Button */}
            <Button
              className="login-btn"
              label={isLoggingIn ? "Logging in..." : "Login"}
              icon={isLoggingIn ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
              type="submit"
              disabled={isLoggingIn || !loginform.isValid}
              loading={isLoggingIn} // PrimeReact loading state
            />

          </div>
        </div>
      </form>

      <div className="shopping-cart-container">
        <img src={log} alt="Login illustration" />
      </div>
    </div>
  );
};

export default Login;
