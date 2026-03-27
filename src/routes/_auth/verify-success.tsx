import { createFileRoute, Link } from "@tanstack/react-router";
import AuthCloudLayout from "@/components/auth/AuthCloudLayout";

const SUCCESS_IMAGE =
  "https://pixabay.com/get/ge5c01ae8b56420128055312dcc3488de58e3d1eda8a151f711d37cb657f1398674a96bb9eb95d724ae920a1f48962419.jpg";

export const Route = createFileRoute("/_auth/verify-success")({ component: VerifySuccessPage });

function VerifySuccessPage() {
  return (
    <AuthCloudLayout
      imageUrl={SUCCESS_IMAGE}
      imageAlt="Happy African American family together outdoors — AlisaDyson on Pixabay"
    >
      <div className="rounded-2xl p-8 sm:p-10 shadow-md" style={{ backgroundColor: "#ddd9ce" }}>
        <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl leading-snug tracking-wide mb-4">
          VERIFICATION SUCCESSFUL!
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          You are now part of the family, enjoy the premium benefits that Vouchcare offers you.
        </p>

        <Link
          to="/home"
          className="block w-full text-center bg-[#1B2880] text-white font-display font-bold text-base py-3.5 rounded-xl hover:bg-navy-dark transition-colors"
        >
          Continue to Home
        </Link>
      </div>
    </AuthCloudLayout>
  );
}
