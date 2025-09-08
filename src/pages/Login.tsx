// pages/Login.tsx (or components/Login.tsx)
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import log from '../assets/log.png'
import { LoginDTO } from "../modules"
// import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const navigate = useNavigate();
  const navigate = useNavigate()

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
     onSubmit: () => {
       login(loginform.values);
      navigate('/home')
    },
  });
  const { login } = useAuth();


  return (
    <div className="flex flex-nowrap login-form-container">
      <form className="" onSubmit={loginform.handleSubmit}>
        <div className="login-container">
          <h1 className="font-bold">Themely Login</h1>


          <div className="login-form">
            <small className="p-error">{loginform.touched.email && loginform.errors.email}</small>
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
              />
            </div>

            <small className="p-error">{loginform.touched.password && loginform.errors.password}</small>
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
              />
            </div>

            <Button
              className="login-btn"
              label={loginform.isSubmitting ? "Logging in..." : "Login"}
              icon="pi pi-sign-in"
              type="submit"
              disabled={loginform.isSubmitting}
            />
          </div>
        </div>
      </form>

      <div className="shopping-cart-container">
        <img src={log} />
      </div>
    </div>
  );
};

export default Login;
