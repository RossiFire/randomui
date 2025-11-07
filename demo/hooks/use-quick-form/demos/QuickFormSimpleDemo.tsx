"use client";

import { DemoBlock } from "@/components/demoBlock";
import { Button } from "@/components/ui/button";
import { useQuickForm } from "../useQuickForm";
import { cn } from "@/lib/utils";
import { z } from "zod/v3";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Too short"),
  isTosAccepted: z.boolean().refine((val) => val, { message: "You must accept the terms and conditions" }),
  interests: z.array(z.string()).min(2, "You must select at least two options"),
});

const QuickFormSimpleDemo: React.FC = () => {

  const { touched, errors, data, set, submit, isDirty, isValid, reset, toggleInArray} = useQuickForm(
    { email: '', username: '', isTosAccepted: false, interests: [] },
    schema
  );

  const handleSubmit = () => {
    alert(data.email + ' - ' + data.username + ' - ' + data.interests.join(', '));
  }

  return (
    <DemoBlock className="m-0" containerClassName="flex flex-col gap-4 pb-12">
      <h2>Let's get in touch</h2>
      <form onSubmit={submit(handleSubmit)} onReset={reset} className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Username</label>
                <input
                    placeholder="Username"
                    type="text"
                    value={data.username}
                    onChange={(e) => set('username', e.target.value)}
                    className="px-3 py-2 border rounded-md bg-fd-background placeholder:text-fd-muted-foreground placeholder:text-sm"
                />
                {errors.username && touched('username') && (
                    <span className="text-xs text-red-500">{errors.username}</span>
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
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-medium">Interested in</label>
          <div className="flex flex-wrap gap-2">
            <Badge 
              className="cursor-pointer" 
              variant={data.interests.includes('Marketing') ? 'default' : 'outline'} 
              onClick={() => {
                toggleInArray('interests', 'Marketing');
              }}>Marketing</Badge>
            <Badge 
              className="cursor-pointer" 
              variant={data.interests.includes('AI') ? 'default' : 'outline'} 
              onClick={() => {
                toggleInArray('interests', 'AI');
              }}>AI</Badge>
            <Badge 
              className="cursor-pointer" 
              variant={data.interests.includes('Development') ? 'default' : 'outline'} 
              onClick={() => {
                toggleInArray('interests', 'Development');
              }}>Development</Badge>
            <Badge 
              className="cursor-pointer" 
              variant={data.interests.includes('Sales') ? 'default' : 'outline'} 
              onClick={() => {
                toggleInArray('interests', 'Sales');
              }}>Sales</Badge>
          </div>
          {errors.interests && touched('interests') && (
            <span className="text-xs text-red-500">{errors.interests}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center text-sm">
                <Checkbox 
                    id="isTosAccepted" 
                    checked={data.isTosAccepted} 
                    onCheckedChange={(checked) => set('isTosAccepted', checked as boolean)} 
                />
                <div className="flex flex-col gap-1">
                    <label htmlFor="isTosAccepted" className="text-sm">I accept fake terms and conditions</label>
                    {errors.isTosAccepted && touched('isTosAccepted') && (
                        <span className="text-xs text-red-500">{errors.isTosAccepted}</span>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="reset" disabled={!isDirty}>Reset</Button>
                <Button type="submit" disabled={!isValid}>Submit</Button>
            </div>

        </div>

      </form>
    </DemoBlock>
  );
};

export { QuickFormSimpleDemo };
