import type { MetaFunction } from "@remix-run/node";
import { useId } from "react";
import { Copy } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const meta: MetaFunction = () => {
  return [
    { title: "DevUtils - Number Base Converter" },
    { name: "description", content: "DevUtils - Number Base Converter" },
  ];
};

export default function NumberBaseConverter() {
  const binaryId = useId();
  const octalId = useId();
  const decimalId = useId();
  const hexadecimalId = useId();
  const customeBaseId = useId();

  return (
    <div className="p-4 grid gap-4">
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={binaryId} className="leading-6">
            Base 2 (Binary)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-slate-500"
          >
            Clear
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="number"
            id={binaryId}
            placeholder="10101"
            className="flex-1"
          />
          <Button>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={octalId} className="leading-6">
            Base 8 (Octal)
          </Label>{" "}
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-slate-500"
          >
            Clear
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="number"
            id={octalId}
            placeholder="124753"
            className="flex-1"
          />
          <Button>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={decimalId} className="leading-6">
            Base 10 (Decimal)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-slate-500"
          >
            Clear
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="number"
            id={decimalId}
            placeholder="149281002"
            className="flex-1"
          />
          <Button>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={hexadecimalId} className="leading-6">
            Base 16 (Hex)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-slate-500"
          >
            Clear
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="number"
            id={hexadecimalId}
            placeholder="1a2b549f"
            className="flex-1"
          />
          <Button>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center gap-3">
          <Label htmlFor={customeBaseId} className="leading-6 h-6">
            <span>Select base: </span>
            <span className="inline-block ml-2">
              <Select defaultValue="32">
                <SelectTrigger className="p-1 h-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Base</SelectLabel>
                    {Array.from({ length: 31 }, (_, i) => i + 2).map((base) => (
                      <SelectItem key={base} value={`${base}`}>
                        {base}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-slate-500"
          >
            Clear
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input type="number" id={customeBaseId} className="flex-1" />
          <Button>
            <Copy /> Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
