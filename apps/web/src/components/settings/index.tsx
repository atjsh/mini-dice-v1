import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

export function SettingsList({
  className = '',
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={`divide-y divide-gray-200 overflow-hidden rounded-xl bg-gray-50 shadow-sm dark:divide-zinc-700 dark:bg-zinc-900 ${className}`}
    />
  );
}

export function SettingsNavigationLabel({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="break-words leading-6">{title}</span>
      {subtitle !== undefined && (
        <span className="break-words text-sm font-normal leading-5 text-gray-500 dark:text-zinc-400">
          {subtitle}
        </span>
      )}
    </span>
  );
}

export function SettingsNavigationLink({
  children,
  className = '',
  ...props
}: Omit<LinkProps, 'children'> & {
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        {...props}
        className={`flex min-h-[52px] w-full items-center gap-3 px-4 py-2.5 font-medium text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-gray-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 ${className}`}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5 shrink-0 text-gray-400 dark:text-zinc-500"
        >
          <path
            d="m7.5 4 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </li>
  );
}

export function SettingsCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg bg-gray-50 p-3 shadow-sm  dark:bg-zinc-900 ${className}`}
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
      <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
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
      } ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

type SettingsActionButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'dangerGhost';

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

export function SettingsActionLink({
  variant = 'primary',
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: SettingsActionButtonVariant;
}) {
  return (
    <a
      {...props}
      className={`inline-block rounded-lg px-4 py-2 text-center font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 ${settingsActionButtonVariantClassNames[variant]} ${className}`}
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
