// /components/ui/menubar.tsx
import React, { ReactNode } from 'react';

// Menubar Component
export const Menubar: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar p-absolute">{children}</div>;
};

// MenubarMenu Component
export const MenubarMenu: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar-menu">{children}</div>;
};

// MenubarTrigger Component (Trigger for opening the menu)
export const MenubarTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <button className="menubar-trigger">{children}</button>;
};

// MenubarContent Component (The content inside the menu)
export const MenubarContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar-content">{children}</div>;
};

// MenubarItem Component (A single item inside a menu)
export const MenubarItem: React.FC<{ children: ReactNode; disabled?: boolean; inset?: boolean }> = ({
  children,
  disabled = false,
  inset = false,
}) => {
  return (
    <div className={`menubar-item ${disabled ? 'disabled' : ''} ${inset ? 'inset' : ''}`}>
      {children}
    </div>
  );
};

// MenubarSeparator Component (A separator between menu items)
export const MenubarSeparator: React.FC = () => {
  return <div className="menubar-separator" />;
};

// MenubarCheckboxItem Component (Checkbox inside a menu)
export const MenubarCheckboxItem: React.FC<{ children: ReactNode; checked?: boolean }> = ({ children, checked = false }) => {
  return (
    <label className="menubar-checkbox-item">
      <input type="checkbox" checked={checked} />
      {children}
    </label>
  );
};

// MenubarSub Component (Submenu)
export const MenubarSub: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar-sub">{children}</div>;
};

// MenubarSubTrigger Component (Trigger for submenu)
export const MenubarSubTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar-sub-trigger">{children}</div>;
};

// MenubarSubContent Component (Content of the submenu)
export const MenubarSubContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="menubar-sub-content">{children}</div>;
};

// MenubarRadioGroup Component (Radio group inside menu)
export const MenubarRadioGroup: React.FC<{ children: ReactNode; value: string }> = ({ children, value }) => {
  return <div className="menubar-radio-group">{children}</div>;
};

// MenubarRadioItem Component (A single radio item)
export const MenubarRadioItem: React.FC<{ children: ReactNode; value: string }> = ({ children, value }) => {
  return (
    <label className="menubar-radio-item">
      <input type="radio" name="profile" value={value} />
      {children}
    </label>
  );
};

// MenubarShortcut Component (Shortcut for an item)
export const MenubarShortcut: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="menubar-shortcut">{children}</span>;
};
