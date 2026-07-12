import React, { useEffect, useRef } from 'react';
import { JBTimePicker, type JBTimePickerWebComponent, type TimeUnits } from 'jb-time-picker/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '../../../docs/styles/ant-design.css';
import '../../../docs/styles/aurora.css';
import '../../../docs/styles/bootstrap.css';
import '../../../docs/styles/candy.css';
import '../../../docs/styles/carbon.css';
import '../../../docs/styles/cupertino.css';
import '../../../docs/styles/fluent.css';
import '../../../docs/styles/forest.css';
import '../../../docs/styles/material.css';
import '../../../docs/styles/porcelain.css';
import '../../../docs/styles/sunset.css';
import '../../../docs/styles/terminal.css';
import './styles/style-ant-design.css';
import './styles/style-aurora.css';
import './styles/style-bootstrap.css';
import './styles/style-candy.css';
import './styles/style-carbon.css';
import './styles/style-cupertino.css';
import './styles/style-fluent.css';
import './styles/style-forest.css';
import './styles/style-material.css';
import './styles/style-porcelain.css';
import './styles/style-sunset.css';
import './styles/style-terminal.css';

const meta = {
  title: "Components/form elements/JBTimePicker/Style",
  component: JBTimePicker,
} satisfies Meta<typeof JBTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const styleSamples = [
  { name: "Carbon", className: "carbon-style", focus: "hour" },
  { name: "Aurora", className: "aurora-style", focus: "minute" },
  { name: "Forest", className: "forest-style", focus: "second" },
  { name: "Sunset", className: "sunset-style", focus: "hour" },
  { name: "Porcelain", className: "porcelain-style", focus: "minute" },
  { name: "Candy", className: "candy-style", focus: "second" },
  { name: "Terminal", className: "terminal-style", focus: "hour" },
  { name: "Material", className: "material-style", focus: "minute" },
  { name: "Fluent", className: "fluent-style", focus: "second" },
  { name: "Bootstrap", className: "bootstrap-style", focus: "hour" },
  { name: "Cupertino", className: "cupertino-style", focus: "minute" },
  { name: "Ant Design", className: "ant-design-style", focus: "second" },
] satisfies Array<{ name: string; className: string; focus: TimeUnits }>;

function FocusedTimePicker({
  className,
  focus,
  secondEnabled = true,
}: {
  className: string;
  focus: TimeUnits;
  secondEnabled?: boolean;
}) {
  const element = useRef<JBTimePickerWebComponent>(null);

  useEffect(() => {
    element.current?.setTimeUnitFocus(focus);
  }, [focus]);

  return (
    <JBTimePicker
      ref={element}
      className={className}
      value={secondEnabled ? { hour: 9, minute: 24, second: 36 } : { hour: 9, minute: 24 }}
      frontalZero
      secondEnabled={secondEnabled}
      optionalUnits={secondEnabled ? ["second"] : []}
      textWidth={160}
    />
  );
}

function TimePickerStyleSample({ className, focus }: { className: string; focus: TimeUnits }) {
  return (
    <div style={{
      display: "grid",
      gap: "1rem",
      width: "100%",
      justifyItems: "center",
    }}>
      <FocusedTimePicker className={className} focus={focus} />
      <FocusedTimePicker className={className} focus="minute" secondEnabled={false} />
    </div>
  );
}

export const Gallery: Story = {
  name: "Gallery",
  render: () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
      gap: "1.25rem",
      alignItems: "start",
      width: "min(100%, 76rem)",
    }}>
      {styleSamples.map((sample) => (
        <section
          key={sample.className}
          style={{
            display: "grid",
            gap: "0.75rem",
            minWidth: 0,
            padding: "1rem",
            background: "var(--jb-surface, #ffffff)",
            border: "1px solid var(--jb-border-color, #e5e7eb)",
            borderRadius: "0.75rem",
            boxShadow: "0 0.75rem 1.75rem oklch(0% 0 0 / 0.08)",
          }}
          className={sample.className.split(" ")[0]}
        >
          <div style={{
            width: "100%",
            color: "var(--jb-text-primary, #334155)",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
          }}>
            {sample.name}
          </div>
          <TimePickerStyleSample className={sample.className} focus={sample.focus} />
        </section>
      ))}
    </div>
  ),
};

export const Default: Story = { name: "Default", render: () => <TimePickerStyleSample className="" focus="hour" /> };
export const Carbon: Story = { name: "Carbon", render: () => <TimePickerStyleSample className="carbon-style" focus="hour" /> };
export const Aurora: Story = { name: "Aurora", render: () => <TimePickerStyleSample className="aurora-style" focus="minute" /> };
export const Forest: Story = { name: "Forest", render: () => <TimePickerStyleSample className="forest-style" focus="second" /> };
export const Sunset: Story = { name: "Sunset", render: () => <TimePickerStyleSample className="sunset-style" focus="hour" /> };
export const Porcelain: Story = { name: "Porcelain", render: () => <TimePickerStyleSample className="porcelain-style" focus="minute" /> };
export const Candy: Story = { name: "Candy", render: () => <TimePickerStyleSample className="candy-style" focus="second" /> };
export const Terminal: Story = { name: "Terminal", render: () => <TimePickerStyleSample className="terminal-style" focus="hour" /> };
export const Material: Story = { name: "Material", render: () => <TimePickerStyleSample className="material-style" focus="minute" /> };
export const Fluent: Story = { name: "Fluent", render: () => <TimePickerStyleSample className="fluent-style" focus="second" /> };
export const Bootstrap: Story = { name: "Bootstrap", render: () => <TimePickerStyleSample className="bootstrap-style" focus="hour" /> };
export const Cupertino: Story = { name: "Cupertino", render: () => <TimePickerStyleSample className="cupertino-style" focus="minute" /> };
export const AntDesign: Story = { name: "Ant Design", render: () => <TimePickerStyleSample className="ant-design-style" focus="second" /> };
