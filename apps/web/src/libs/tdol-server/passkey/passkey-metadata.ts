import metadataUrl from '../../../../vendor/passkey-authenticator-aaguids/aaguid.json?url';

export interface PasskeyAaguidMetadata {
  name: string;
  icon_light?: string;
  icon_dark?: string;
}

let metadataPromise: Promise<Record<string, PasskeyAaguidMetadata>> | undefined;

function isMetadataEntry(value: unknown): value is PasskeyAaguidMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    (!('icon_light' in value) || typeof value.icon_light === 'string') &&
    (!('icon_dark' in value) || typeof value.icon_dark === 'string')
  );
}

function isMetadataCollection(
  value: unknown,
): value is Record<string, PasskeyAaguidMetadata> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isMetadataEntry)
  );
}

async function fetchMetadata(): Promise<Record<string, PasskeyAaguidMetadata>> {
  try {
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to load passkey metadata: ${response.status}`);
    }

    const metadata: unknown = await response.json();
    return isMetadataCollection(metadata) ? metadata : {};
  } catch {
    return {};
  }
}

function loadMetadata(): Promise<Record<string, PasskeyAaguidMetadata>> {
  return (metadataPromise ??= fetchMetadata());
}

export async function getPasskeyMetadata(
  aaguid: string | null | undefined,
): Promise<PasskeyAaguidMetadata | null> {
  if (!aaguid) {
    return null;
  }

  const metadata = await loadMetadata();
  return metadata[aaguid.toLowerCase()] ?? null;
}
