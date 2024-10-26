import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "DevUtils" },
    { name: "description", content: "DevUtils" },
  ];
};

export default function Index() {
  return <div></div>;
}
