import metadataUrl from '../../../../vendor/passkey-authenticator-aaguids/aaguid.json?url';

export interface PasskeyAaguidMetadata {
  name: string;
  icon_light?: string;
  icon_dark?: string;
}

let metadataPromise: Promise<Record<string, PasskeyAaguidMetadata>> | undefined;

function loadMetadata() {
  return (metadataPromise ??= fetch(metadataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load passkey metadata: ${response.status}`);
      }

      return response.json() as Promise<Record<string, PasskeyAaguidMetadata>>;
    })
    .catch(() => ({})));
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
