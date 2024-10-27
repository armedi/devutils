import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/number-base-converter", 307);
};

export default function Index() {
  return null;
}
