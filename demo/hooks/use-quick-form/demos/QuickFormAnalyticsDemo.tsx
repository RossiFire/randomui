"use client";

import { DemoBlock } from "@/components/demoBlock";
import { useQuickFormAnalytics } from "../useQuickFormAnalytics";
import { Button } from "@/components/ui/button";
import { useQuickForm } from "../useQuickForm";
import { z } from "zod/v3";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  email: z.string().email("Invalid email"),
  interestedIn: z.array(z.string()).min(2, "You must select at least two options"),
});

const QuickFormAnalyticsDemo: React.FC = () => {
  const form = useQuickForm({ email: '', interestedIn: [] }, schema);
  
  const analytics = useQuickFormAnalytics(form.ref);

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const handleSubmit = () => {
    alert(form.data.email);
  }

  const toggleInterest = (interest: string) => {
    if (form.data.interestedIn.includes(interest)) {
      form.set('interestedIn', form.data.interestedIn.filter((i) => i !== interest));
    } else {
      form.set('interestedIn', [...form.data.interestedIn, interest]);
    }
  }

  return (
    <DemoBlock className="m-0" containerClassName="flex flex-col gap-4 pb-12">
      <h2>Subscribe to my oldsletter</h2>
      <form onSubmit={form.submit(handleSubmit)} onReset={form.reset} className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="my@email.com"
            value={form.data.email}
            onChange={(e) => form.set('email', e.target.value)}
            onFocus={() => analytics.trackFocus('email')}
            onBlur={() => analytics.trackBlur('email')}
            className="px-3 py-2 border rounded-md bg-fd-background placeholder:text-fd-muted-foreground placeholder:text-sm"
          />
          {form.errors.email && form.touched('email') && (
            <span className="text-xs text-red-500">{form.errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Interested in</label>
          <div className="flex flex-wrap gap-2">
            <Badge 
              className="cursor-pointer" 
              variant={form.data.interestedIn.includes('Marketing') ? 'default' : 'outline'} 
              onClick={() => {
                analytics.trackFocus('interestedIn');
                toggleInterest('Marketing');
                analytics.trackBlur('interestedIn');
              }}>Marketing</Badge>
            <Badge 
              className="cursor-pointer" 
              variant={form.data.interestedIn.includes('AI') ? 'default' : 'outline'} 
              onClick={() => {
                analytics.trackFocus('interestedIn');
                toggleInterest('AI');
                analytics.trackBlur('interestedIn');
              }}>AI</Badge>
            <Badge 
              className="cursor-pointer" 
              variant={form.data.interestedIn.includes('Development') ? 'default' : 'outline'} 
              onClick={() => {
                analytics.trackFocus('interestedIn');
                toggleInterest('Development');
                analytics.trackBlur('interestedIn');
              }}>Development</Badge>
          </div>
          {form.errors.interestedIn && form.touched('interestedIn') && (
            <span className="text-xs text-red-500">{form.errors.interestedIn}</span>
          )}
        </div>
        <Button disabled={!form.isValid} type="submit" className="ml-auto">
          Submit
        </Button>
        <div className="flex flex-col gap-2 p-3 bg-fd-accent/10 rounded-md text-xs">
          <div className="font-medium">Analytics</div>
          <div>Completion: {(analytics.analytics.completionRate * 100).toFixed(0)}%</div>
          <div>Email interactions: {analytics.analytics.fieldInteractions.email || 0}</div>
          <div>Interests interactions: {analytics.analytics.fieldInteractions.interestedIn || 0}</div>
          <div>Time on email: {formatTime(analytics.analytics.timeOnField.email || 0)}</div>
          {analytics.analytics.abandonedFields.length > 0 && (
            <div>Abandoned: {analytics.analytics.abandonedFields.join(', ')}</div>
          )}
        </div>
      </form>
    </DemoBlock>
  );
};

export { QuickFormAnalyticsDemo };
