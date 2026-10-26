import { describe, test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { THEME_STORAGE_KEY, resolveTheme, routeDefaultTheme, themeBootScript } from "../src/lib/theme.ts";

function runBootScript({ stored, pathname, systemPrefersDark, storageThrows = false }) {
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(themeBootScript, {
    document: { documentElement: root },
    location: { pathname },
    localStorage: {
      getItem(key) {
        if (storageThrows) throw new Error("blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    matchMedia: (query) => ({ matches: query === "(prefers-color-scheme: dark)" && systemPrefersDark }),
  });
  return root;
}

const paths = ["/", "/clients", "/clients/", "/community", "/community/", "/chat", "/clientsx"];
const storedValues = [null, "light", "dark", "invalid"];

describe("theme resolution", () => {
  test("route defaults apply only to the audience routes", () => {
    assert.equal(routeDefaultTheme("/clients"), "light");
    assert.equal(routeDefaultTheme("/community"), "dark");
    assert.equal(routeDefaultTheme("/"), null);
    assert.equal(routeDefaultTheme("/chat"), null);
    assert.equal(routeDefaultTheme("/clientsx"), null);
  });

  test("an explicit preference wins on every route", () => {
    for (const pathname of paths) {
      for (const systemPrefersDark of [false, true]) {
        assert.equal(resolveTheme({ stored: "light", pathname, systemPrefersDark }), "light");
        assert.equal(resolveTheme({ stored: "dark", pathname, systemPrefersDark }), "dark");
      }
    }
  });

  test("without a preference, audience routes use their default and others follow the system", () => {
    assert.equal(resolveTheme({ stored: null, pathname: "/clients", systemPrefersDark: true }), "light");
    assert.equal(resolveTheme({ stored: null, pathname: "/community", systemPrefersDark: false }), "dark");
    assert.equal(resolveTheme({ stored: null, pathname: "/", systemPrefersDark: true }), "dark");
    assert.equal(resolveTheme({ stored: "invalid", pathname: "/", systemPrefersDark: false }), "light");
  });

  test("the pre-paint boot script matches resolveTheme for every case", () => {
    for (const pathname of paths) {
      for (const stored of storedValues) {
        for (const systemPrefersDark of [false, true]) {
          const root = runBootScript({ stored, pathname, systemPrefersDark });
          const expected = resolveTheme({ stored, pathname, systemPrefersDark });
          assert.equal(root.dataset.theme, expected, `${pathname} stored=${stored} systemDark=${systemPrefersDark}`);
          assert.equal(root.style.colorScheme, expected);
        }
      }
    }
  });

  test("the boot script still resolves when storage is unavailable", () => {
    assert.equal(runBootScript({ stored: "dark", pathname: "/clients", systemPrefersDark: true, storageThrows: true }).dataset.theme, "light");
    assert.equal(runBootScript({ stored: "light", pathname: "/", systemPrefersDark: true, storageThrows: true }).dataset.theme, "dark");
  });
});
