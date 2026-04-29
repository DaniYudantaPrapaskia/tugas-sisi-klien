export default function Header({ title }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
