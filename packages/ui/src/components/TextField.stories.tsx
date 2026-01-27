import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Design System/TextField",
  component: TextField,
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm p-6 bg-gray-50">
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        helperText="We’ll never share your email."
      />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="max-w-sm p-6 bg-gray-50">
      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        helperText="Use at least 8 characters."
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="max-w-sm p-6 bg-gray-50">
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        defaultValue="wrong-email-format"
        error="Please enter a valid email address."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm p-6 bg-gray-50">
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        disabled
        defaultValue="disabled@company.com"
        helperText="This field is disabled."
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="max-w-sm p-6 bg-gray-50 space-y-4">
        <TextField
          label="Name"
          name="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
          helperText="This example uses a controlled input."
        />
        <div className="text-sm text-gray-700">Value: {value || "—"}</div>
      </div>
    );
  },
};
