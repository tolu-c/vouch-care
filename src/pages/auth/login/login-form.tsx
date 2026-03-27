import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { TextInput } from "@/components/form/TextInput";
import { login } from "@/server/auth";
import { loginSchema } from "@/server/schemas/auth";

export function LoginForm() {
  const navigate = useNavigate();

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = loginSchema.safeParse(value);
        if (!result.success) return result.error.issues[0]?.message;
        return undefined;
      },
    },
    async onSubmit({ value }) {
      console.log("submitting ", value);

      const result = await login({ data: value });

      if (!result.success) {
        console.log(result.error || "An unknown error occurred");
        return;
      }

      navigate({ to: "/find-care" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
      className="w-full flex flex-col gap-4 items-end"
    >
      <Field name="email">
        {(field) => <TextInput field={field} placeholder="Email" type="email" />}
      </Field>

      <Field name="password">
        {(field) => <TextInput field={field} placeholder="Password" type="password" />}
      </Field>

      <Link to="/forgot-password">Forgot Password?</Link>

      <Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full flex items-center justify-center h-12 rounded-md bg-blue-700 hover:bg-blue-800 text-blue-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-bold cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        )}
      </Subscribe>
    </form>
  );
}
