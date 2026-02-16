import { Check, AlertCircle } from "lucide-react";

const Notification = ({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) => {
  return (
    <div>
      <div className="fixed mt-3 top-0 left-1/2 -translate-x-1/2 z-[100] w-max">
        <div
          className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-2 ${
            type === "success" ? "bg-[#fca481]" : "bg-red-500"
          } text-white text-sm font-semibold`}
        >
          {type === "success" ? (
            <Check size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message}
        </div>
      </div>
    </div>
  );
};

export default Notification;
