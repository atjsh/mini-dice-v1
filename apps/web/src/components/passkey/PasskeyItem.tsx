import type { PasskeyListItemDto } from '@packages/shared-types';
import type { PasskeyAaguidMetadata } from '../../libs/tdol-server/passkey/passkey-metadata';
import { SettingsGroupedItem, SettingsPopover } from '../settings';

interface PasskeyItemProps {
  passkey: PasskeyListItemDto & {
    metadata: PasskeyAaguidMetadata | null;
  };
  onDelete: () => void;
  onRename: (newName: string) => void;
}

function toDate(date: Date | null) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('ko-kr');
}

function getPasskeyIconSources(
  metadata: PasskeyAaguidMetadata | null | undefined,
) {
  if (!metadata) {
    return null;
  }

  const lightSource = metadata.icon_light ?? metadata.icon_dark;
  const darkSource = metadata.icon_dark ?? metadata.icon_light;

  if (!lightSource || !darkSource) {
    return null;
  }

  return { lightSource, darkSource };
}

function PasskeyMetadataIcon({
  lightSource,
  darkSource,
}: {
  lightSource: string;
  darkSource: string;
}) {
  return (
    <picture className="flex h-9 w-9 items-center justify-center">
      {darkSource !== lightSource && (
        <source media="(prefers-color-scheme: dark)" srcSet={darkSource} />
      )}
      <img
        src={lightSource}
        alt=""
        className="max-h-9 max-w-9 object-contain"
      />
    </picture>
  );
}

function PasskeySubtitle({
  createdAt,
  kindLabel,
}: {
  createdAt: Date | null;
  kindLabel: string;
}) {
  const parsedDate = toDate(createdAt);

  return (
    <span className="flex flex-wrap items-center gap-x-1.5">
      <span>{kindLabel}</span>
      <span aria-hidden="true">·</span>
      {parsedDate && (
        <span>
          등록일자:{' '}
          <time dateTime={parsedDate.toISOString()}>
            {formatDate(parsedDate)}
          </time>
        </span>
      )}
    </span>
  );
}

export function PasskeyItem({ passkey, onDelete, onRename }: PasskeyItemProps) {
  const manageLabel = `${passkey.name} 패스키 관리`;
  const metadataLabel = passkey.metadata?.name;
  const subtitleLabel =
    metadataLabel && metadataLabel !== passkey.name
      ? `패스키 · ${metadataLabel}`
      : '패스키';
  const iconSources = getPasskeyIconSources(passkey.metadata);

  return (
    <SettingsGroupedItem
      title={passkey.name}
      subtitle={
        <PasskeySubtitle
          createdAt={passkey.createdAt}
          kindLabel={subtitleLabel}
        />
      }
      leading={
        iconSources ? <PasskeyMetadataIcon {...iconSources} /> : undefined
      }
      action={
        <SettingsPopover
          ariaLabel={manageLabel}
          panelClassName="w-44"
          trigger={({ ref: triggerRef, props: triggerProps }) => (
            <button
              ref={triggerRef}
              {...triggerProps}
              aria-label={manageLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-800 active:bg-gray-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:active:bg-zinc-700"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <circle cx="4" cy="10" r="1.4" />
                <circle cx="10" cy="10" r="1.4" />
                <circle cx="16" cy="10" r="1.4" />
              </svg>
            </button>
          )}
        >
          {({ close, restoreFocusIfUnclaimed }) => (
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    close(false);
                    requestAnimationFrame(() => {
                      const nextName = window.prompt(
                        '패스키 이름을 입력하세요. (최대 100자)',
                        passkey.name,
                      );

                      if (nextName === null) {
                        restoreFocusIfUnclaimed();
                        return;
                      }

                      const normalizedName = nextName.trim();
                      if (normalizedName.length === 0) {
                        window.alert('패스키 이름을 입력해 주세요.');
                        restoreFocusIfUnclaimed();
                        return;
                      }
                      if (normalizedName.length > 100) {
                        window.alert('패스키 이름은 100자 이하여야 합니다.');
                        restoreFocusIfUnclaimed();
                        return;
                      }
                      if (normalizedName === passkey.name) {
                        restoreFocusIfUnclaimed();
                        return;
                      }

                      restoreFocusIfUnclaimed();
                      onRename(normalizedName);
                    });
                  }}
                  className="min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-gray-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
                >
                  이름 변경
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    close(false);
                    requestAnimationFrame(() => {
                      const shouldDelete = window.confirm(
                        `“${passkey.name}” 패스키를 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`,
                      );

                      restoreFocusIfUnclaimed();
                      if (shouldDelete) {
                        onDelete();
                      }
                    });
                  }}
                  className="min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
                >
                  삭제
                </button>
              </li>
            </ul>
          )}
        </SettingsPopover>
      }
    />
  );
}
