import React, { useState } from "react";
import LoginForm from "./LoginForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
     
        <>
          <LoginForm />
          {/*Aqui se eliminio el formulario de registro*/}
        </>
      
    </div>
  );
}
