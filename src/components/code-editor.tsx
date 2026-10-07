"use client";

import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = "260px",
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-soft">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[java()]}
        editable={!readOnly}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          tabSize: 4,
        }}
      />
    </div>
  );
}