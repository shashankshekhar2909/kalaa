import { Layout } from "../Layout";
import { Catalog, Different, GetStarted, Hero, Pigments, Sharp } from "../sections";

export function Home() {
  return (
    <Layout current="home">
      <Hero />
      <Different />
      <Sharp />
      <Pigments />
      <Catalog />
      <GetStarted />
    </Layout>
  );
}
