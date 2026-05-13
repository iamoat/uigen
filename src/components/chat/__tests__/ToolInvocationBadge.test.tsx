import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeTool(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "call"
): ToolInvocation {
  if (state === "result") {
    return { state, toolCallId: "1", toolName, args, result: "ok" };
  }
  return { state, toolCallId: "1", toolName, args };
}

test("shows 'Creating' for str_replace_editor create command", () => {
  render(<ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" })} />);
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor str_replace command", () => {
  render(<ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "str_replace", path: "/components/Button.tsx" })} />);
  expect(screen.getByText("Editing /components/Button.tsx")).toBeDefined();
});

test("shows 'Editing' for str_replace_editor insert command", () => {
  render(<ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "insert", path: "/index.ts" })} />);
  expect(screen.getByText("Editing /index.ts")).toBeDefined();
});

test("shows 'Viewing' for str_replace_editor view command", () => {
  render(<ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "view", path: "/App.jsx" })} />);
  expect(screen.getByText("Viewing /App.jsx")).toBeDefined();
});

test("shows 'Renaming' for file_manager rename command", () => {
  render(<ToolInvocationBadge tool={makeTool("file_manager", { command: "rename", path: "/old.tsx", new_path: "/new.tsx" })} />);
  expect(screen.getByText("Renaming /old.tsx")).toBeDefined();
});

test("shows 'Deleting' for file_manager delete command", () => {
  render(<ToolInvocationBadge tool={makeTool("file_manager", { command: "delete", path: "/unused.tsx" })} />);
  expect(screen.getByText("Deleting /unused.tsx")).toBeDefined();
});

test("falls back to tool name for unknown tool", () => {
  render(<ToolInvocationBadge tool={makeTool("unknown_tool", {})} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles args as a JSON string", () => {
  const tool = {
    state: "result" as const,
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: JSON.stringify({ command: "create", path: "/App.jsx" }),
    result: "ok",
  };
  render(<ToolInvocationBadge tool={tool as any} />);
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows spinner when pending", () => {
  const { container } = render(
    <ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")} />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
});

test("shows green dot when done", () => {
  const { container } = render(
    <ToolInvocationBadge tool={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeFalsy();
});
