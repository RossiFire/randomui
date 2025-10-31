import { OpenAI } from "openai";
import { err, ok } from "@/lib/handled-response";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { files, outputFormat } = body as {
      files: UploadedFileContent[];
      outputFormat: string;
    };

    // Validate input
    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { success: false, error: "Files array is required" },
        { status: 400 }
      );
    }

    if (!outputFormat || typeof outputFormat !== 'string') {
      return NextResponse.json(
        { success: false, error: "Output format is required" },
        { status: 400 }
      );
    }

    // Check system prompts
    if (!systemPrompts[0] || !systemPrompts[1]) {
      return NextResponse.json(
        { success: false, error: "System prompts are not configured" },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompts[0] },
        { role: "user", content: `Convert to: ${outputFormat}\n\nFiles: ${JSON.stringify(files)}` },
        { role: "assistant", content: systemPrompts[1] },
      ],
      model: model as ChatCompletionCreateParamsBase["model"],
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      return NextResponse.json(
        { success: false, error: "NO_RESPONSE_FROM_AI_MODEL" },
        { status: 500 }
      );
    }

    const parsedResponse = JSON.parse(response) satisfies ChatResponse;

    return NextResponse.json(
      { success: true, data: parsedResponse },
      { status: 200 }
    );

  } catch (error) {
    console.error("Code migration error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "UNEXPECTED_ERROR" 
      },
      { status: 500 }
    );
  }
}

