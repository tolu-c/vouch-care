import type { AnyFieldApi } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import FormError from "@/components/form/FormError";
import { AUTH_PASSWORD_INPUT_CLASS, AUTH_TEXT_INPUT_CLASS } from "@/components/form/formClasses";

interface TextInputProps {
  field: AnyFieldApi;
  placeholder?: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
}

export function TextInput({ field, placeholder, type = "text", autoComplete }: TextInputProps) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div className={isPassword ? "relative" : undefined}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={isPassword ? AUTH_PASSWORD_INPUT_CLASS : AUTH_TEXT_INPUT_CLASS}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <FormError
        show={field.state.meta.isTouched && field.state.meta.errors.length > 0}
        error={field.state.meta.errors[0]}
      />
    </div>
  );
}
