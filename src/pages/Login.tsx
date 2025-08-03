import { useState } from "react";
import { authLogin } from "../services";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Login = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setpassword] = useState<string>();

  const login = () => {
    const data = {
      email: userName,
      password: password,
    };
    authLogin(data);
  };

  return (
    <form className="login-form-container">
      <div className="login-container">
      {/* <h1 className="font-bold">Welcome in Timply</h1> */}
        <h1 className="font-bold">Login</h1>
        <div className="login-form">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <InputText
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <Button label="Login" icon="pi pi-sign-in" onClick={login} />
        </div>
      </div>
    </form>
  );
};

export default Login;
