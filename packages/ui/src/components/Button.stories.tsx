import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary action" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary action" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

export const FullWidth: Story = {
  args: { variant: "primary", fullWidth: true, children: "Continue" },
};
