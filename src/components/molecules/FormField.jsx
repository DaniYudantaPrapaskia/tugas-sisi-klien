import Label from "../atoms/Label";
import Input from "../atoms/Input";

export default function FormField({ label, ...props }) {
   return (
      <div className="mb-4">
         <Label>{label}</Label>
         <Input {...props} />
      </div>
   );
}
