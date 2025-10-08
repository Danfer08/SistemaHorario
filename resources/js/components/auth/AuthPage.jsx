import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <>
          <LoginForm />
          <p className="text-center mt-4">
            ¿No tienes cuenta?{" "}
            <button onClick={() => setIsLogin(false)} className="text-green-700 font-bold">
              Crear cuenta
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
          <p className="text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => setIsLogin(true)} className="text-green-700 font-bold">
              Inicia sesión
            </button>
          </p>
        </>
      )}
    </div>
  );
}
