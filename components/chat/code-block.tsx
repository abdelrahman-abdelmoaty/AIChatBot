"use client";

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({ node, inline, className, children, ...props }: CodeBlockProps) {
  return (
    <code
      className={`${className} relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`}
      {...props}
    >
      {children}
    </code>
  );
}
