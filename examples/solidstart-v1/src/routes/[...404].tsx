import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <div class="max-w-2xl mx-auto text-center">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
      <p class="text-gray-600">
        The page you're looking for doesn't exist.{" "}
        <a href="/" class="text-blue-500 hover:underline">
          Go back home
        </a>
      </p>
    </div>
  );
}
