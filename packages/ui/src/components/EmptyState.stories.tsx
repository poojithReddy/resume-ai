import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Design System/EmptyState",
  component: EmptyState,
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Simple: Story = {
  args: {
    title: "No runs yet",
    description: "Start a new analysis to see results here.",
  },
};

export const WithPrimaryAction: Story = {
  args: {
    title: "No results found",
    description: "Try the demo to see an example result.",
    primaryAction: { label: "Open demo", onClick: () => alert("demo") },
  },
};

export const WithTwoActions: Story = {
  args: {
    title: "Nothing to show",
    description: "Create a new run or load sample data.",
    secondaryAction: { label: "Load sample", onClick: () => alert("sample") },
    primaryAction: { label: "New analysis", onClick: () => alert("new") },
  },
};

export const ErrorState: Story = {
  args: {
    title: "Something went wrong",
    description: "Please try again.",
    primaryAction: { label: "Retry", onClick: () => alert("retry") },
  },
};
