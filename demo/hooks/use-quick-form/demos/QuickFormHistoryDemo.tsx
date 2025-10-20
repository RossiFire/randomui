"use client";

import { DemoBlock } from "@/components/demoBlock";
import { useQuickFormHistory } from "../useQuickFormHistory";
import { Button } from "@/components/ui/button";
import { useQuickForm } from "../useQuickForm";
import { z } from "zod/v3";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email"),
  fullName: z.string().min(3, "Too short"),
  description: z.string().min(6, "Min 6 characters"),
});

const QuickFormHistoryDemo = () => {
  const { data, set, submit, errors, touched, isDirty, isValid, reset, setData } = useQuickForm({ email: '', fullName: '', description: '' }, schema);
  const { undo, redo, canUndo, canRedo, clearHistory, historySize, redoSize, jumpTo } = useQuickFormHistory(data, setData, { maxSize: 20, debounceMs: 500 });

  const handleSubmit = () => {
    alert(data.description);
  }

  return (
    <DemoBlock className="m-0" containerClassName="flex flex-col gap-4 pb-12">
      <h2>Tell us about yourself</h2>
      <form onSubmit={submit(handleSubmit)} onReset={reset} className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                    placeholder="Full Name"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    className="px-3 py-2 border rounded-md bg-fd-background placeholder:text-fd-muted-foreground placeholder:text-sm"
                />
                {errors.fullName && touched('fullName') && (
                    <span className="text-xs text-red-500">{errors.fullName}</span>
                )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Email</label>
                <input
                    placeholder="my@email.com"
                    type="email"
                    value={data.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={cn(
                        "px-3 py-2 border rounded-md bg-fd-background placeholder:text-fd-muted-foreground placeholder:text-sm"
                    )}
                />
                {(errors.email && touched('email')) && (
                    <span className="text-xs text-red-500">{errors.email}</span>
                )}
            </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="Describe yourself..."
            value={data.description}
            onChange={(e) => set('description', e.target.value)}
            className="px-3 py-2 border rounded-md bg-fd-background placeholder:text-fd-muted-foreground placeholder:text-sm"
          />
          {errors.description && touched('description') && (
            <span className="text-xs text-red-500">{errors.description}</span>
          )}
        </div>
        <div className="flex items-center justify-between mx-auto">
            <div className="flex gap-2">
                <Button type="button" onClick={undo} disabled={!canUndo}>Undo {canUndo ? '(' + historySize + ')' : ''}</Button>
                <Button type="button" onClick={redo} disabled={!canRedo}>Redo {canRedo ? '(' + redoSize + ')' : ''}</Button>
                <Button type="button" onClick={clearHistory} disabled={historySize <= 0}>Clear History</Button>
                <Button type="reset" disabled={!isDirty}>Reset</Button>
            </div>
        </div>
      </form>
      <span className="text-xs text-fd-muted-foreground">History update has a debounce of 500ms, you can customize it</span>
    </DemoBlock>
  );
};

export default QuickFormHistoryDemo;
