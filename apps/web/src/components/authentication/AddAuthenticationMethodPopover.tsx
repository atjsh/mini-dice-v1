import { SettingsActionButton, SettingsPopover } from '../settings';

interface AuthenticationMethodOptionBase {
  id: string;
  label: string;
  description: string;
}

export type AuthenticationMethodOption =
  | (AuthenticationMethodOptionBase & {
      kind: 'link';
      href: string;
    })
  | (AuthenticationMethodOptionBase & {
      kind: 'button';
      onSelect: () => void | Promise<void>;
    });

export function AddAuthenticationMethodPopover({
  options,
  isBusy,
}: {
  options: AuthenticationMethodOption[];
  isBusy: boolean;
}) {
  return (
    <SettingsPopover
      ariaLabel="로그인 방법 추가"
      busyStatus={isBusy ? '패스키 추가 중…' : ''}
      layoutKey={options.length}
      panelClassName="w-80"
      trigger={({ ref: triggerRef, props: triggerProps }) => (
        <SettingsActionButton
          ref={triggerRef}
          {...triggerProps}
          disabled={isBusy}
          variant="primary"
          className="inline-flex min-h-[44px] items-center gap-2 px-3 py-2 text-sm"
        >
          {!isBusy && (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          )}
          {isBusy ? '패스키 추가 중…' : '로그인 방법 추가'}
        </SettingsActionButton>
      )}
    >
      {({ close, focusFallback, restoreFocusIfUnclaimed }) => (
        <>
          <div className="px-3 pb-2 pt-2">
            <p className="text-xs opacity-50">로그인 방법 추가</p>
          </div>
          <ul className="flex flex-col gap-1">
            {options.map((option) => {
              const optionContent = (
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-5 text-gray-500 dark:text-gray-400">
                    {option.description}
                  </span>
                </span>
              );
              const optionClassName =
                'flex min-h-[56px] w-full items-center rounded-lg px-3 py-2 text-left hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:active:bg-zinc-700';

              return (
                <li key={option.id}>
                  {option.kind === 'link' ? (
                    <a
                      href={option.href}
                      onClick={() => close(false)}
                      className={optionClassName}
                    >
                      {optionContent}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        close(false);
                        focusFallback();
                        try {
                          await option.onSelect();
                        } finally {
                          restoreFocusIfUnclaimed();
                        }
                      }}
                      className={optionClassName}
                    >
                      {optionContent}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </SettingsPopover>
  );
}
