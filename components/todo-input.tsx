"use client";

import { useState } from "react";
import {
  CATEGORIES,
  DEFAULT_PRIORITY,
  PRIORITIES,
  type Category,
  type Priority,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 선택 칩의 아이콘과 선택 시 그라데이션. 접근성 이름에는 포함하지 않는다.
const CHIP_STYLES: Record<Priority | Category | "none", { icon: string; selected: string }> = {
  high: { icon: "🔥", selected: "from-rose-500 to-orange-400 shadow-rose-500/40" },
  medium: { icon: "⚡", selected: "from-amber-500 to-orange-500 shadow-amber-500/40" },
  low: { icon: "🌱", selected: "from-emerald-400 to-teal-400 shadow-emerald-400/40" },
  none: { icon: "✨", selected: "from-slate-500 to-slate-400 shadow-slate-500/40" },
  work: { icon: "💼", selected: "from-blue-500 to-cyan-400 shadow-blue-500/40" },
  personal: { icon: "🏡", selected: "from-emerald-500 to-lime-400 shadow-emerald-500/40" },
  shopping: { icon: "🛍️", selected: "from-violet-500 to-fuchsia-400 shadow-violet-500/40" },
};

const CHIP_BASE =
  "rounded-full border px-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-95";

function chipClass(key: keyof typeof CHIP_STYLES, selected: boolean) {
  return cn(
    CHIP_BASE,
    selected
      ? cn(
          "border-transparent bg-linear-to-r text-white shadow-md hover:text-white",
          CHIP_STYLES[key].selected
        )
      : "bg-background/60 hover:shadow-sm"
  );
}

function ChipIcon({ name }: { name: keyof typeof CHIP_STYLES }) {
  return <span aria-hidden="true">{CHIP_STYLES[name].icon}</span>;
}

interface TodoInputProps {
  onAdd: (
    text: string,
    priority: Priority,
    dueDate?: string,
    category?: Category
  ) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // 빈/공백 입력이면 추가하지 않고 선택값(우선순위·마감일·카테고리)도 유지한다.
    if (!value.trim()) return;
    onAdd(value, priority, dueDate || undefined, category);
    setValue("");
    setPriority(DEFAULT_PRIORITY);
    setDueDate("");
    setCategory(undefined);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>할 일 추가</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="할 일을 입력하고 Enter를 누르세요"
            aria-label="새 할 일"
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="마감일"
            className="w-auto"
          />

          <div role="radiogroup" aria-label="우선순위" className="flex flex-wrap gap-2">
            {PRIORITIES.map((item) => {
              const selected = item.value === priority;
              return (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant="outline"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPriority(item.value)}
                  className={chipClass(item.value, selected)}
                >
                  <ChipIcon name={item.value} />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div role="radiogroup" aria-label="카테고리" className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              role="radio"
              aria-checked={category === undefined}
              onClick={() => setCategory(undefined)}
              className={chipClass("none", category === undefined)}
            >
              <ChipIcon name="none" />
              없음
            </Button>
            {CATEGORIES.map((item) => {
              const selected = item.value === category;
              return (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant="outline"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCategory(item.value)}
                  className={chipClass(item.value, selected)}
                >
                  <ChipIcon name={item.value} />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full animate-gradient-shift bg-linear-to-r from-[#FF0080] via-[#7928CA] to-[#0070F3] bg-size-[200%_auto] font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/40 active:scale-[0.98]"
          >
            <span aria-hidden="true">✨</span>
            추가
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
