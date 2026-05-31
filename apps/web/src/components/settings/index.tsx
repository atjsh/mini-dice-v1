import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export function SettingsCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      {children}
    </section>
  );
}

export function SettingsHeader({
  title,
  description,
  className = '',
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <h2 className="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

export function SettingsToggle({
  checked,
  disabled,
  onChange,
  ariaLabel,
  className = '',
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={checked}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-700'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

type SettingsActionButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dangerGhost';

const settingsActionButtonVariantClassNames: Record<
  SettingsActionButtonVariant,
  string
> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:text-white dark:disabled:bg-zinc-700',
  secondary:
    'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:text-white dark:disabled:bg-zinc-700',
  ghost:
    'text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  dangerGhost:
    'text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
};

export function SettingsActionButton({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: SettingsActionButtonVariant;
}) {
  return (
    <button
      {...props}
      type={type}
      className={`rounded-lg px-4 py-2 font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-zinc-900 ${settingsActionButtonVariantClassNames[variant]} ${className}`}
    />
  );
}

export function SettingsNotice({
  tone,
  children,
  className = '',
  ...props
}: {
  tone: 'success' | 'error' | 'neutral';
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const toneClassNames = {
    success:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-100',
    error:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-100',
    neutral:
      'border-gray-200 bg-gray-50 text-gray-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400',
  }[tone];

  return (
    <div
      {...props}
      className={`rounded-lg border px-4 py-3 text-sm ${toneClassNames} ${className}`}
    >
      {children}
    </div>
  );
}
