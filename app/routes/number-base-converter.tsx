import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "DevUtils - Number Base Converter" },
    { name: "description", content: "DevUtils - Number Base Converter" },
  ];
};

export default function NumberBaseConverter() {
  return <div></div>;
}
