import type { MetaFunction } from "@remix-run/node";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Copy } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "DevUtils - Unix Time Converter - Convert Unix Timestamps, ISO 8601, and Milliseconds",
    },
    {
      name: "description",
      content:
        "Free online Unix timestamp converter. Convert between Unix timestamps, ISO 8601 dates, and milliseconds. Features local time, UTC, relative time, day/week of year calculations, and multiple date formats.",
    },
    {
      name: "keywords",
      content:
        "unix timestamp converter, epoch converter, unix time, iso 8601, timestamp to date, date to timestamp, milliseconds converter, utc converter",
    },
    {
      property: "og:title",
      content:
        "DevUtils -Unix Time Converter - Convert Unix Timestamps, ISO 8601, and Milliseconds",
    },
    {
      property: "og:description",
      content:
        "Free online Unix timestamp converter. Convert between Unix timestamps, ISO 8601 dates, and milliseconds. Features local time, UTC, relative time, day/week of year calculations, and multiple date formats.",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://devutils.armedi.id/unix-time-converter",
    },
    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content:
        "Unix Time Converter - Convert Unix Timestamps, ISO 8601, and Milliseconds",
    },
    {
      name: "twitter:description",
      content:
        "Free online Unix timestamp converter. Convert between Unix timestamps, ISO 8601 dates, and milliseconds. Features local time, UTC, relative time, day/week of year calculations, and multiple date formats.",
    },
  ];
};

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);
dayjs.extend(localizedFormat);

// Types
type InputFormat = "unix" | "ms" | "iso";
type TimeUnit = {
  unit: "year" | "month" | "day" | "hour" | "minute" | "second";
  label: string;
  manipulateType: dayjs.ManipulateType;
};

// Constants
const TIME_UNITS: TimeUnit[] = [
  { unit: "year", label: "yr", manipulateType: "year" },
  { unit: "month", label: "mo", manipulateType: "month" },
  { unit: "day", label: "d", manipulateType: "day" },
  { unit: "hour", label: "hr", manipulateType: "hour" },
  { unit: "minute", label: "min", manipulateType: "minute" },
  { unit: "second", label: "sec", manipulateType: "second" },
];

const DATE_FORMAT_OPTIONS = [
  "dddd, MMM D, YYYY",
  "L",
  "YYYY-MM-DD",
  "MM-DD-YYYY HH:mm",
  "MMM D, h:mm A",
  "MMMM YYYY",
] as const;

const INPUT_VALIDATION = {
  NUMERIC: /^[0-9+\-*/ ().\s]*$/,
  ISO: /^[0-9-:T.Z+]*$/,
} as const;

const FORMAT_PLACEHOLDERS: Record<InputFormat, string> = {
  iso: "2024-01-01T00:00:00.000+07:00",
  ms: "1704067200000",
  unix: "1704067200",
} as const;

// Interfaces
interface TimeDisplayFieldProps {
  label?: string;
  value: string;
}

// Hooks
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Utility functions
function calculateTimeDifference(earlier: dayjs.Dayjs, later: dayjs.Dayjs) {
  let current = earlier;
  const result = new Map<TimeUnit["unit"], number>();

  for (const { unit, manipulateType } of TIME_UNITS) {
    if (unit === "month") {
      let years = later.year() - current.year();
      let months = later.month() - current.month();
      if (months < 0) {
        years--;
        months += 12;
      }
      result.set("year", years);
      result.set("month", months);
      current = current.add(years, "year").add(months, "month");
    } else {
      const value = Math.floor(later.diff(current, unit, true));
      result.set(unit, value);
      current = current.add(value, manipulateType);
    }
  }

  return result;
}

function parseDateInput(
  value: string,
  format: InputFormat
): dayjs.Dayjs | null {
  try {
    const evaluatedValue =
      format !== "iso" ? new Function(`return ${value}`)() : value;

    const parsedDate =
      format === "unix"
        ? dayjs.unix(Number(evaluatedValue))
        : format === "ms"
        ? dayjs(Number(evaluatedValue))
        : dayjs(evaluatedValue);

    return parsedDate.isValid() ? parsedDate : null;
  } catch {
    return null;
  }
}

function convertToFormat(date: dayjs.Dayjs, format: InputFormat): string {
  const formatMap: Record<InputFormat, () => string> = {
    unix: () => String(date.unix()),
    ms: () => String(date.valueOf()),
    iso: () => date.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  };

  return formatMap[format]();
}

function getExactRelativeTime(date: dayjs.Dayjs) {
  const now = dayjs();
  const isPast = now.isAfter(date);
  const [earlier, later] = isPast ? [date, now] : [now, date];

  const differences = calculateTimeDifference(earlier, later);

  const parts = TIME_UNITS.map(({ unit, label }) => {
    const value = differences.get(unit) || 0;
    return value > 0 ? `${value}${label}` : "";
  }).filter(Boolean);

  if (parts.length === 0) {
    parts.push("0sec");
  }

  return `${parts.join(" ")} ${isPast ? "ago" : "from now"}`;
}

// Components
function TimeDisplayField({ label, value }: TimeDisplayFieldProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="space-y-1.5">
      {label && <h2 className="text-sm font-medium">{label}</h2>}
      <div className="flex items-center gap-2">
        <Input value={value} readOnly className="text-sm" />
        <Button size="icon" variant="outline" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function RelativeTime({ date }: { date: dayjs.Dayjs | null }) {
  const [, setTick] = useState({});
  useInterval(() => setTick({}), date ? 1000 : null);

  return (
    <TimeDisplayField
      label="Relative:"
      value={date ? getExactRelativeTime(date) : "-"}
    />
  );
}

export default function UnixTimeConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputFormat, setInputFormat] = useState<InputFormat>("unix");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputId = useId();

  useEffect(() => {
    if (!inputValue) {
      setDate(null);
      setError(null);
      return;
    }

    const parsedDate = parseDateInput(inputValue, inputFormat);
    if (parsedDate) {
      setDate(parsedDate);
      setError(null);
    } else {
      setDate(null);
      setError("Invalid input");
    }
  }, [inputValue, inputFormat]);

  const handleNowClick = () => {
    const now = dayjs();
    setInputValue(convertToFormat(now, inputFormat));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const regex =
      inputFormat === "iso" ? INPUT_VALIDATION.ISO : INPUT_VALIDATION.NUMERIC;

    if (newValue === "" || regex.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleFormatChange = (value: InputFormat) => {
    if (date) {
      setInputValue(convertToFormat(date, value));
    } else {
      setInputValue("");
    }
    setInputFormat(value);
  };

  return (
    <div>
      {/* Input Section */}
      <div className="space-y-1.5 mb-4 px-2 md:px-4">
        <div className="flex items-center gap-3">
          <Label htmlFor={inputId} className="leading-6 h-6">
            Input
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="py-1 h-auto rounded-xl text-xs text-muted-foreground"
            onClick={handleNowClick}
          >
            Now
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            id={inputId}
            type="text"
            placeholder={FORMAT_PLACEHOLDERS[inputFormat]}
            className={cn(
              "flex-1",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Select value={inputFormat} onValueChange={handleFormatChange}>
            <SelectTrigger className="basis-[260px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unix">
                Unix time (seconds since epoch)
              </SelectItem>
              <SelectItem value="ms">Milliseconds since epoch</SelectItem>
              <SelectItem value="iso">ISO 8601</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          {inputFormat === "iso"
            ? "Format: YYYY-MM-DDTHH:mm:ss.SSS±HH:mm"
            : "Tips: Mathematical operators + - * / are supported"}
        </p>
      </div>

      <Separator className="p-0 md:p-0" />

      {/* Three Column Layout */}
      <div className="lg:grid lg:grid-cols-[1fr_8rem_1fr] gap-8 my-4 px-2 md:px-4 space-y-4 lg:space-y-0">
        {/* Left Column */}
        <div className="space-y-4">
          <TimeDisplayField
            label="Local:"
            value={date ? date.format("ddd MMM DD HH:mm:ss Z YYYY") : "-"}
          />
          <TimeDisplayField
            label="UTC (ISO 8601):"
            value={date ? date.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : "-"}
          />
          <RelativeTime date={date} />
          <TimeDisplayField
            label="Unix time:"
            value={date ? date.unix().toString() : "-"}
          />
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          <TimeDisplayField
            label="Day of year"
            value={date ? date.dayOfYear().toString() : "-"}
          />
          <TimeDisplayField
            label="Week of year"
            value={date ? date.week().toString() : "-"}
          />
          <TimeDisplayField
            label="Is leap year?"
            value={date ? date.isLeapYear().toString() : "-"}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-1.5">
          <h2 className="text-sm font-medium">Other formats (local):</h2>
          <div className="space-y-1.5">
            {DATE_FORMAT_OPTIONS.map((format, index) => (
              <TimeDisplayField
                key={index}
                value={date ? date.format(format) : "-"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
