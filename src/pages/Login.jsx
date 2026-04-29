import Card from "../components/molecules/Card";
import Form from "../components/organisms/Form";

export default function Login() {
  return (
    <Card>
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Login
      </h1>
      <Form />
    </Card>
  );
}
