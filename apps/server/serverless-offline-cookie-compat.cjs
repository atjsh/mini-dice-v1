'use strict';

const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');

const EXPECTED_VERSIONS = {
  '@hapi/hapi': '21.4.9',
  '@hapi/statehood': '8.2.1',
  serverless: '3.40.0',
  'serverless-offline': '13.10.1',
};
const FORMAT_PATCH = Symbol.for('mini-dice.serverless-offline-cookie-compat');
const REFRESH_COOKIE_NAME = 'refreshToken';
const SET_COOKIE_ATTRIBUTES =
  /^; Max-Age=\d+; Path=\/; HttpOnly; Secure; SameSite=None$/;
const CLEAR_COOKIE_ATTRIBUTES =
  '; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

function readPackage(entryPath, expectedName) {
  let directory = path.dirname(entryPath);
  const root = path.parse(directory).root;

  while (directory !== root) {
    const packagePath = path.join(directory, 'package.json');

    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (packageJson.name === expectedName) {
        return packageJson;
      }
    }

    directory = path.dirname(directory);
  }

  throw new Error(
    `[serverless-offline-cookie-compat] Could not resolve ${expectedName}'s package metadata.`,
  );
}

function assertVersion(packageJson) {
  const expectedVersion = EXPECTED_VERSIONS[packageJson.name];

  if (packageJson.version !== expectedVersion) {
    throw new Error(
      `[serverless-offline-cookie-compat] Expected ${packageJson.name}@${expectedVersion}, ` +
        `but found ${packageJson.version}. Remove or revalidate the compatibility shim before running Offline.`,
    );
  }
}

function resolveStatehood() {
  const serviceRequire = createRequire(__filename);
  const serverlessEntry = serviceRequire.resolve('serverless');
  const offlineEntry = serviceRequire.resolve('serverless-offline');
  const offlineRequire = createRequire(offlineEntry);
  const hapiEntry = offlineRequire.resolve('@hapi/hapi');
  const hapiRequire = createRequire(hapiEntry);
  const statehoodEntry = hapiRequire.resolve('@hapi/statehood');

  const packageJsons = [
    readPackage(serverlessEntry, 'serverless'),
    readPackage(offlineEntry, 'serverless-offline'),
    readPackage(hapiEntry, '@hapi/hapi'),
    readPackage(statehoodEntry, '@hapi/statehood'),
  ];

  packageJsons.forEach(assertVersion);

  return hapiRequire('@hapi/statehood');
}

function getRefreshCookieHeader(cookie) {
  if (
    cookie.name !== REFRESH_COOKIE_NAME ||
    typeof cookie.value !== 'string' ||
    !cookie.value.includes(';')
  ) {
    return undefined;
  }

  if (
    cookie.options?.encoding !== 'none' ||
    cookie.options.strictHeader !== false
  ) {
    throw new Error(
      '[serverless-offline-cookie-compat] Unexpected refresh-cookie formatter options.',
    );
  }

  if (/[\r\n]/u.test(cookie.value)) {
    throw new Error(
      '[serverless-offline-cookie-compat] Refusing a refresh cookie containing a line break.',
    );
  }

  const attributeIndex = cookie.value.indexOf(';');
  const value = cookie.value.slice(0, attributeIndex);
  const attributes = cookie.value.slice(attributeIndex);
  const isSetCookie =
    value.length > 0 && SET_COOKIE_ATTRIBUTES.test(attributes);
  const isClearCookie =
    value.length === 0 && attributes === CLEAR_COOKIE_ATTRIBUTES;

  if (!isSetCookie && !isClearCookie) {
    throw new Error(
      '[serverless-offline-cookie-compat] Unexpected refresh-cookie attributes. Revalidate the compatibility shim.',
    );
  }

  return `${cookie.name}=${cookie.value}`;
}

function patchStatehoodFormatter() {
  const Statehood = resolveStatehood();
  const definitionsPrototype = Statehood.Definitions?.prototype;

  if (
    typeof definitionsPrototype?.format !== 'function' ||
    definitionsPrototype.format.length !== 2
  ) {
    throw new Error(
      '[serverless-offline-cookie-compat] Statehood formatter shape changed. Remove or revalidate the compatibility shim.',
    );
  }

  if (definitionsPrototype[FORMAT_PATCH]) {
    return;
  }

  const originalFormat = definitionsPrototype.format;

  definitionsPrototype.format = async function formatWithRefreshCookieCompat(
    cookies,
    context,
  ) {
    const outputOrder = [];
    const regularCookies = [];
    let hasRefreshCookie = false;

    for (const cookie of cookies) {
      const refreshCookieHeader = getRefreshCookieHeader(cookie);

      if (refreshCookieHeader === undefined) {
        outputOrder.push(undefined);
        regularCookies.push(cookie);
      } else {
        outputOrder.push(refreshCookieHeader);
        hasRefreshCookie = true;
      }
    }

    if (!hasRefreshCookie) {
      return await originalFormat.call(this, cookies, context);
    }

    const formattedCookies = await originalFormat.call(
      this,
      regularCookies,
      context,
    );

    if (formattedCookies.length !== regularCookies.length) {
      throw new Error(
        '[serverless-offline-cookie-compat] Statehood formatter output changed. Remove or revalidate the compatibility shim.',
      );
    }

    let formattedCookieIndex = 0;

    return outputOrder.map(
      (refreshCookieHeader) =>
        refreshCookieHeader ?? formattedCookies[formattedCookieIndex++],
    );
  };

  Object.defineProperty(definitionsPrototype, FORMAT_PATCH, {
    value: true,
  });
}

class ServerlessOfflineCookieCompat {
  constructor() {
    this.hooks = {
      'before:offline:start': patchStatehoodFormatter,
      'before:offline:start:init': patchStatehoodFormatter,
    };
  }
}

module.exports = ServerlessOfflineCookieCompat;
