import { FieldInputProps } from "@/type/type";
import { AlertCircle } from "lucide-react";



export const renderField = ({
  label,
  type = "text",
  placeholder,
  register: reg,
  error,
  icon,
  endAdornment,
}: FieldInputProps) => (
  <div className="input-group">
    <label className="block text-sm font-semibold mb-2 text-[#242E49]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]">
        {icon}
      </div>
      <input
        type={type}
        {...reg}
        placeholder={placeholder}
        className={`w-full pl-12 py-3 rounded-xl border-2 outline-none bg-white/50 text-[#181A2F] ${
          endAdornment ? "pr-12" : "pr-4"
        } ${
          error
            ? "border-[#B4182D]"
            : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
        }`}
      />
      {endAdornment && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {endAdornment}
        </div>
      )}
    </div>
    {error && (
      <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1">
        <AlertCircle size={16} />
        {error.message}
      </p>
    )}
  </div>
);
