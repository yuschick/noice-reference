import {
  isAndroid,
  isChrome,
  isChromeOS,
  isDuckDuckGo,
  isEdge,
  isFirefox,
  isIe,
  isIe10,
  isIe11,
  isIe9,
  isIos,
  isIosSafari,
  isIpadOS,
  isMobileFirefox,
  isOpera,
  isSafari,
  isSamsungBrowser,
  isSilk,
} from '@braintree/browser-detection';

enum BrowserCheckBrowsers {
  Chrome = 'Chrome',
  DuckDuckGo = 'DuckDuckGo',
  Edge = 'Edge',
  Firefox = 'Firefox',
  Safari = 'Safari',
  IE = 'IE',
  Opera = 'Opera',
  SamsungBrowser = 'SamsungBrowser',
  Silk = 'Silk',
}

const browserChecks: Record<BrowserCheckBrowsers, boolean> = {
  [BrowserCheckBrowsers.Chrome]: isChrome(),
  [BrowserCheckBrowsers.DuckDuckGo]: isDuckDuckGo(),
  [BrowserCheckBrowsers.Edge]: isEdge(),
  [BrowserCheckBrowsers.Firefox]: isFirefox() || isMobileFirefox(),
  [BrowserCheckBrowsers.Safari]: isSafari() || isIosSafari(),
  [BrowserCheckBrowsers.Opera]: isOpera(),
  [BrowserCheckBrowsers.SamsungBrowser]: isSamsungBrowser(),
  [BrowserCheckBrowsers.Silk]: isSilk(),
  [BrowserCheckBrowsers.IE]: isIe() || isIe10() || isIe11() || isIe9(),
};

enum BrowserCheckOS {
  Android = 'Android',
  ChromeOS = 'ChromeOS',
  IOS = 'iOS',
  IpadOS = 'IpadOS',
}

const osChecks: Record<BrowserCheckOS, boolean> = {
  [BrowserCheckOS.Android]: isAndroid(),
  [BrowserCheckOS.ChromeOS]: isChromeOS(),
  [BrowserCheckOS.IOS]: isIos(),
  [BrowserCheckOS.IpadOS]: isIpadOS(),
};

export const getCurrentBrowser = () => {
  const currentBrowser = Object.keys(browserChecks).find(
    (browser) => browserChecks[browser as BrowserCheckBrowsers],
  );

  return currentBrowser;
};

export const getCurrentOS = () => {
  const currentOS = Object.keys(osChecks).find((os) => osChecks[os as BrowserCheckOS]);

  return currentOS;
};

const supportedBrowsers = [
  BrowserCheckBrowsers.Chrome,
  BrowserCheckBrowsers.Edge,
  BrowserCheckBrowsers.Opera,
  BrowserCheckBrowsers.Safari,
  BrowserCheckBrowsers.Firefox,
];

export const checkBrowserSupport = () => {
  return supportedBrowsers.some((browser) => {
    return browserChecks[browser];
  });
};
