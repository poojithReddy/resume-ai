import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./PageHeader";
import { Button } from "./Button";

const meta: Meta<typeof PageHeader> = {
  title: "Design System/PageHeader",
  component: PageHeader,
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: { title: "Dashboard" },
};

export const WithSubtitle: Story = {
  args: { title: "Settings", subtitle: "Preferences are stored locally on this device." },
};

export const WithActions: Story = {
  args: {
    title: "Results",
    subtitle: "Review candidate scores and evidence.",
    actions: (
      <>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">New run</Button>
      </>
    ),
  },
};

export const LongText: Story = {
  args: {
    title: "Candidate screening for Senior Machine Learning Engineer roles",
    subtitle: "Compare resumes against requirements and keep review consistent across the shortlist.",
  },
};
