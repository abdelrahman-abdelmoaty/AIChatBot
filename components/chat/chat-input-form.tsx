"use client";

import { useRef, useEffect, RefObject } from "react";
import { Send, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatInputForm({
  input,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  files,
  fileInputRef,
  setFiles,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>, options?: { experimental_attachments?: FileList }) => void;
  isSubmitting: boolean;
  files: FileList | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setFiles: (files: FileList | undefined) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Handle the image file here
  //     // You can add logic to upload the image and get a URL
  //     console.log("Image selected:", file);
  //   }
  // };

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        handleSubmit(event, {
          experimental_attachments: files,
        });

        setFiles(undefined);

        if (fileInputRef && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }}
      className="flex w-full items-end gap-2 max-w-3xl mx-auto"
    >
      <div className="relative w-full max-w-3xl">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="min-h-[80px] pr-24 resize-none focus-visible:ring-1 focus-visible:ring-offset-0 border-muted"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim()) {
                handleSubmit(e as any);
              }
            }
          }}
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="sr-only">Upload image</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" disabled={isSubmitting || !input.trim()} className="h-8 w-8">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message (Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  );
}
