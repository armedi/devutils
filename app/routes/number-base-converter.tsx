import type { MetaFunction } from "@remix-run/node";
import { useId, useState, useCallback } from "react";
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
    { name: "description", content: "Convert numbers between different bases including binary, octal, decimal, hexadecimal, and custom bases with ease using DevUtils." },
    { name: "keywords", content: "Number Base Converter, Binary to Decimal, Hexadecimal to Binary, Decimal to Hex, Custom Base Conversion, DevUtils" },
    { name: "author", content: "Armedi" },
    { property: "og:title", content: "DevUtils - Number Base Converter" },
    { property: "og:description", content: "Easily convert numbers across various bases with this efficient tool." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://armedi.id/u/number-base-converter" },
    { name: "twitter:title", content: "DevUtils - Number Base Converter" },
    { name: "twitter:description", content: "Effortlessly convert numbers between binary, octal, decimal, hex, and custom bases with DevUtils." },
  ];
};

const isValidForBase = (value: string, base: number) => {
  if (!value) return true;
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const validChars = chars.slice(0, base);
  const regex = new RegExp(`^[${validChars}]*(\\.[${validChars}]*)?$`, "i");
  return regex.test(value);
};

const convertBase = (value: string, fromBase: number, toBase: number): string => {
  if (!value) return "";
  
  // Split into integer and fractional parts
  const [intPart, fracPart = ""] = value.split(".");
  
  // Convert integer part
  const decimal = parseInt(intPart, fromBase);
  let result = decimal.toString(toBase);
  
  // Convert fractional part if exists
  if (fracPart) {
    let fraction = 0;
    for (let i = 0; i < fracPart.length; i++) {
      fraction += parseInt(fracPart[i], fromBase) / Math.pow(fromBase, i + 1);
    }
    
    // Convert fraction to target base
    let fractionalPart = ".";
    const precision = 8; // Maximum precision for fractional part
    for (let i = 0; i < precision; i++) {
      fraction *= toBase;
      const digit = Math.floor(fraction);
      fractionalPart += digit.toString(toBase);
      fraction -= digit;
      if (fraction === 0) break;
    }
    
    result += fractionalPart;
  }
  
  return result.toLowerCase();
};

type BaseValues = {
  "2": string;
  "8": string;
  "10": string;
  "16": string;
  custom: string;
};

interface NumberBaseProps {
  id: string;
  label: string;
  base: keyof BaseValues | number;
  value: string;
  placeholder?: string;
  onChange: (value: string, base: keyof BaseValues | number) => void;
  onClear: (base: keyof BaseValues | number) => void;
  onCopy: (value: string) => void;
  customBase?: {
    value: string;
    onChange: (value: string) => void;
  };
}

function NumberBase({
  id,
  label,
  base,
  value,
  placeholder,
  onChange,
  onClear,
  onCopy,
  customBase,
}: NumberBaseProps) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <div className="flex items-center gap-3">
        <Label htmlFor={id} className="leading-6 h-6">
          {customBase ? (
            <>
              <span>Select base: </span>
              <span className="inline-block ml-2">
                <Select 
                  value={customBase.value}
                  onValueChange={customBase.onChange}
                >
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
            </>
          ) : (
            label
          )}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          className="py-1 h-auto rounded-xl text-xs text-slate-500"
          onClick={() => onClear(base)}
        >
          Clear
        </Button>
      </div>
      <div className="flex w-full items-center space-x-2">
        <Input 
          id={id}
          placeholder={placeholder}
          className="flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value, base)}
        />
        <Button onClick={() => onCopy(value)}>
          <Copy /> Copy
        </Button>
      </div>
    </div>
  );
}

export default function NumberBaseConverter() {
  const binaryId = useId();
  const octalId = useId();
  const decimalId = useId();
  const hexadecimalId = useId();
  const customBaseId = useId();

  const [values, setValues] = useState<BaseValues>({
    "2": "",
    "8": "",
    "10": "",
    "16": "",
    custom: "",
  });
  const [customBase, setCustomBase] = useState("32");

  const handleInputChange = useCallback((value: string, base: keyof BaseValues | number) => {
    const baseNumber = typeof base === "number" ? base : parseInt(base);
    if (base === "custom") {
      if (!isValidForBase(value, parseInt(customBase))) return;
    } else {
      if (!isValidForBase(value, baseNumber)) return;
    }

    const newValues = { ...values, [base]: value };
    
    if (value) {
      // Convert from the changed base to all other bases
      const sourceBase = base === "custom" ? parseInt(customBase) : baseNumber;
      const sourceValue = value;

      [2, 8, 10, 16].forEach((targetBase) => {
        if (targetBase !== sourceBase) {
          newValues[targetBase.toString() as keyof BaseValues] = convertBase(sourceValue, sourceBase, targetBase);
        }
      });
      
      if (sourceBase !== parseInt(customBase)) {
        newValues.custom = convertBase(sourceValue, sourceBase, parseInt(customBase));
      }
    } else {
      // Clear all values if input is empty
      Object.keys(newValues).forEach((key) => {
        newValues[key as keyof BaseValues] = "";
      });
    }

    setValues(newValues);
  }, [values, customBase]);

  const handleCopy = useCallback(async (value: string) => {
    await navigator.clipboard.writeText(value);
  }, []);

  const handleClear = useCallback((base: keyof BaseValues | number) => {
    handleInputChange("", base);
  }, [handleInputChange]);

  const handleCustomBaseChange = useCallback((newBase: string) => {
    const oldBase = parseInt(customBase);
    const newBaseNum = parseInt(newBase);
    setCustomBase(newBase);

    // If there's a value in any of the inputs, convert it to the new base
    const nonEmptyValue = Object.entries(values).find(([key, value]) => {
      if (key === "custom") return false;
      return value !== "";
    });

    if (nonEmptyValue) {
      const [sourceBase, value] = nonEmptyValue;
      const newCustomValue = convertBase(value, parseInt(sourceBase), newBaseNum);
      setValues(prev => ({ ...prev, custom: newCustomValue }));
    } else if (values.custom) {
      // If only custom value exists, convert it from old base to new base
      const newCustomValue = convertBase(values.custom, oldBase, newBaseNum);
      setValues(prev => ({ ...prev, custom: newCustomValue }));
    }
  }, [customBase, values]);

  return (
    <div className="p-4 grid gap-4">
      <NumberBase
        id={binaryId}
        label="Base 2 (Binary)"
        base={2}
        value={values["2"]}
        placeholder="1000111001011101100011101010"
        onChange={handleInputChange}
        onClear={handleClear}
        onCopy={handleCopy}
      />
      <NumberBase
        id={octalId}
        label="Base 8 (Octal)"
        base={8}
        value={values["8"]}
        placeholder="1071354352"
        onChange={handleInputChange}
        onClear={handleClear}
        onCopy={handleCopy}
      />
      <NumberBase
        id={decimalId}
        label="Base 10 (Decimal)"
        base={10}
        value={values["10"]}
        placeholder="149281002"
        onChange={handleInputChange}
        onClear={handleClear}
        onCopy={handleCopy}
      />
      <NumberBase
        id={hexadecimalId}
        label="Base 16 (Hex)"
        base={16}
        value={values["16"]}
        placeholder="8e5d8ea"
        onChange={handleInputChange}
        onClear={handleClear}
        onCopy={handleCopy}
      />
      <NumberBase
        id={customBaseId}
        label=""
        base="custom"
        value={values.custom}
        onChange={handleInputChange}
        onClear={handleClear}
        onCopy={handleCopy}
        customBase={{
          value: customBase,
          onChange: handleCustomBaseChange,
        }}
      />
    </div>
  );
}
