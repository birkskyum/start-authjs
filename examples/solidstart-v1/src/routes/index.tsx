import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main style={{ padding: "1rem" }}>
      <Title>SolidStart + Auth.js</Title>
      <h1>SolidStart + Auth.js Example</h1>
      <p>This example demonstrates Auth.js integration with SolidStart using the start-authjs package.</p>
      <p>Click <strong>Sign In</strong> in the header to authenticate with Auth0, or visit the <a href="/protected">Protected</a> page to see session data.</p>
    </main>
  );
}
