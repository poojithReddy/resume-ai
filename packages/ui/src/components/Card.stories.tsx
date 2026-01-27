import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-3">
        <CardHeader title="Card title" description="Short description" />
        <div className="text-sm text-gray-600">This is card body content.</div>
      </div>
    ),
  },
};

export const PaddingSmall: Story = {
  args: { padding: "sm", children: <div className="text-sm">Small padding</div> },
};

export const PaddingLarge: Story = {
  args: { padding: "lg", children: <div className="text-sm">Large padding</div> },
};

export const WithCustomClass: Story = {
  args: {
    children: <div className="text-sm">Dashed border</div>,
    className: "border-dashed",
  },
};
