export type CountryMetadataType = {
  code2: string;
  code3: string;
  name: string;
  number: string;
};

export const countryMetadataIsoList = [
  {
    code2: 'US',
    code3: 'USA',
    name: '🇺🇸 Unites States (United States of America (the))',
    number: '840',
  },
  {
    code2: 'GB',
    code3: 'GBR',
    name: '🇬🇧 United Kingdom (United Kingdom of Great Britain and Northern Ireland (the))',
    number: '826',
  },
] as const;

export type CountryCode3Type = typeof countryMetadataIsoList[number]['code3'];

export const countryCode3List = countryMetadataIsoList.map(
  ({ code3 }) => code3,
);
