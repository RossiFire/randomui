"use client"
import InputFile from "@/components/ui/file-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { accomplishCodeMigrationTool, ChatResponse } from "@/actions/coddeMigrationTool";
import { CodeBlock, Pre } from "@/components/codeblock";
import { Loader2, AlertCircle, Download, HomeIcon, IterationCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type OutputFormat = "vue" | "jsx" | "tsx" | "svelte";

const MAX_FILES = 1;

const ConverterPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | "">("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const availableSlots = MAX_FILES - files.length;
    const filesToAdd = selectedFiles.slice(0, availableSlots);
    
    if (filesToAdd.length > 0) {
      setFiles(prev => [...prev, ...filesToAdd]);
    }
    
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getInputFileTypes = (): Set<string> => {
    const types = new Set<string>();
    files.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext) types.add(ext);
    });
    return types;
  };

  const getAvailableOutputFormats = (): OutputFormat[] => {
    const inputTypes = getInputFileTypes();
    const allFormats: OutputFormat[] = ["vue", "jsx", "tsx", "svelte"];
    
    return allFormats.filter(format => {
      if (format === "jsx" || format === "tsx") {
        return !inputTypes.has("jsx") && !inputTypes.has("tsx") && !inputTypes.has("js");
      }
      return !inputTypes.has(format);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0 || !outputFormat) return;

    setIsLoading(true);
    setError(null);
    setConvertedFiles(null);

    try {
      const filesContent = await Promise.all(files.map(async file => ({
        name: file.name,
        code: await file.text(),
      })));
      const { error, data } = await accomplishCodeMigrationTool({ 
        files: filesContent, 
        outputFormat: outputFormat as OutputFormat
      });

      if (error) {
        setError(error);
        return;
      }

      setConvertedFiles(data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFiles([]);
    setConvertedFiles(null);
    setError(null);
    setOutputFormat("");
  };

  const availableFormats = getAvailableOutputFormats();

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-6 gap-8">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl my-8 md:my-12">
        <div className="text-center space-y-2 mb-12 relative w-fit">
          <h1 className="text-3xl font-bold text-fd-foreground">Random UI Code Converter <span className="bg-gradient-to-br from-fd-primary to-fd-accent text-transparent bg-clip-text">V1</span></h1>
          <p className="text-fd-muted-foreground">
            Idk it works very poorly, It&apos;s just to say that my website is using AI.
          </p>
          <Link href={'/'} className="absolute -top-4 md:top-1/2 left-0 md:-left-20 -translate-y-1/2 rotate-x-180 w-fit">
            <IterationCwIcon className="size-6" />
          </Link>
        </div>

        {!convertedFiles && (
          <>
            {!isLoading && <InputFile
              onFileChange={handleFileChange}
              label="Upload file (.tsx, .jsx, .vue, .svelte)"
              files={files}
              onRemove={handleRemoveFile}
              maxFiles={MAX_FILES}
            />}

            {files.length > 0 && (
              <div className="w-full max-w-2xl">
                <label htmlFor="output-format" className="block text-sm font-medium text-fd-foreground mb-2">
                  Output Format
                </label>
                <select
                  id="output-format"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  disabled={availableFormats.length === 0}
                  className={cn(
                    "w-full px-3 py-2 rounded-md border bg-fd-background text-fd-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-fd-ring",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <option value="">Select output format...</option>
                  {availableFormats.map(format => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
                {availableFormats.length === 0 && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                    No compatible output formats for selected files
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleConvert}
                className="flex gap-2 items-center"
                disabled={files.length === 0 || isLoading || !outputFormat}
                variant="primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert"
                )}
              </Button>
              {files.length > 0 && !isLoading && (
                <Button onClick={handleReset} variant="secondary">
                  Clear
                </Button>
              )}
            </div>
            {isLoading && <span className="text-sm text-fd-muted-foreground max-w-2xl mx-auto text-center">Since this conversion tool is free to use, it might takes a few to convert your files. Thank you for your patience. (credits will finish at some point)</span>}
            <span className="italic text-fd-muted-foreground text-xs mx-auto text-center">AI make mistakes, so don&apos;t trust it.</span>
          </>
        )}

        {error && (
          <div className={cn(
            "w-full p-4 rounded-lg border flex items-start gap-3",
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
            "text-red-900 dark:text-red-200"
          )}>
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {convertedFiles && (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-fd-foreground">
                Conversion Results
              </h2>
              <Button onClick={handleReset} variant="secondary">
                Convert More
              </Button>
            </div>

            <div className="space-y-6">
              {convertedFiles.files.map((file, index) => {
                return (
                  <div key={index} className="space-y-2">
                    <CodeBlock
                        lang={file.mdxExtension}
                        title={file.name}
                        Actions={({ className, children }) => (
                          <div className={cn("flex items-center gap-1", className)}>
                            <button
                              onClick={() => handleDownload(file.name, file.code)}
                              className={cn(
                                "inline-flex items-center justify-center rounded-md p-1.5",
                                "text-fd-muted-foreground hover:text-fd-accent-foreground",
                                "hover:bg-fd-accent transition-colors"
                              )}
                              aria-label={`Download ${file.name}`}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {children}
                          </div>
                        )}
                      >
                        <Pre>
                          <code>{file.code}</code>
                        </Pre>
                      </CodeBlock>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterPage;