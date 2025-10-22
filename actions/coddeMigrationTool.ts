"use server";

import { OpenAI } from "openai";
import { err, HandledResponse, ok } from "@/lib/handled-response";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

const systemPrompts: (string | undefined)[] = [
  process.env.SYSTEM_PROMPT_BASE,
  process.env.SYSTEM_PROMPT_TWO,
];

const model = process.env.LLM_MODEL;

type UploadedFileContent = {
  name: string;
  code: string;
}

export type ChatResponse = {
  files: {
    name: string;
    code: string;
    mdxExtension: string;
  }[];
}

export const accomplishCodeMigrationTool = async ({
    files,
    outputFormat,
}: {
    files: UploadedFileContent[];
    outputFormat: string;
}): Promise<HandledResponse<ChatResponse,string>> => {
  if (!systemPrompts[0] || !systemPrompts[1]) {
    return err("one or more system prompts are not set");
  }

  try{
    const completion = await openai.chat.completions.create({
      messages: [
          { role: "system", content: systemPrompts[0] },
          { role: "user", content: `Convert to: ${outputFormat}\n\nFiles: ${JSON.stringify(files)}` },
          { role: "assistant", content: systemPrompts[1] },
      ],
      model: model as ChatCompletionCreateParamsBase["model"],
    });
  
    const response = completion.choices[0].message.content;

    const parsedResponse = JSON.parse(response!) satisfies ChatResponse;
    return ok(parsedResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : "An unexpected error occurred");
  }
  
};