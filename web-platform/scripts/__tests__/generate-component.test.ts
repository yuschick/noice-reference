import child from "child_process";
import path from "path";
import fs from "fs/promises";

const MODULE_PATH = path.join(__dirname, '../generate-component.js');
const ARTIFACT_ROOT = path.join(__dirname, "../.tmp/");
const ARTIFACT_WEB_ROOT = path.join(ARTIFACT_ROOT, "./web/components/");
const ARTIFACT_GAME_ROOT = path.join(ARTIFACT_ROOT, "./game/components/");
const ARTIFACT_COMMON_ROOT = path.join(ARTIFACT_ROOT, "./common/components/");

const getArtifactDirectory = (target: 'web' | 'game' | 'common', componentName: string) => {
  switch (target) {
    case 'web':
      return path.join(ARTIFACT_WEB_ROOT, `./${componentName}`);
    case 'game':
      return path.join(ARTIFACT_GAME_ROOT, `./${componentName}`);
    case 'common':
      return path.join(ARTIFACT_COMMON_ROOT, `./${componentName}`);
  }
}

const runProcessAsync = async (...args: string[]): Promise<number> => {
  return new Promise((resolve) => {
    const process = child.fork(MODULE_PATH, args);
    process.on("exit", (code) => resolve(code ?? -1));
  });
};

describe('generate-component', () => {
  jest.setTimeout(10000);

  it("Should error if not given args.", async () => {
    const exitCode = await runProcessAsync();
    expect(exitCode).toEqual(1);
  });

  it("Should error if not given a target.", async () => {
    const exitCode = await runProcessAsync("FakeComponent");
    expect(exitCode).toEqual(1);
  });

  it("Should error if component name is not UpperCase.", async () => {
    const exitCode = await runProcessAsync("fakeComponent", "--web", "--test");
    expect(exitCode).toEqual(1);
  });

  describe('artifacts', () => {
    afterEach(async () => {
      await fs.rm(ARTIFACT_ROOT, { recursive: true });
    });

    it("Should copy the templates to the target directory.", async () => {
      const exitCode = await runProcessAsync("TestComponent", "--web", "--test", "--no-clean");
      expect(exitCode).toEqual(0);

      // Make sure all the files exist
      const webOutput = getArtifactDirectory("web", "TestComponent");
      const webFiles = await fs.readdir(webOutput);
      expect(webFiles).toContain("TestComponent.tsx");
      expect(webFiles).toContain("TestComponent.stories.tsx");
      expect(webFiles).toContain("TestComponent.styles.ts");

      // Make sure the other targets work too.
      const gameCode = await runProcessAsync("TestComponent", "--game", "--test", "--no-clean");
      expect(gameCode).toEqual(0);
      const gameOutput = getArtifactDirectory("web", "TestComponent");
      const gameFiles = await fs.readdir(gameOutput);
      expect(gameFiles).toContain("TestComponent.tsx");
      expect(gameFiles).toContain("TestComponent.stories.tsx");
      expect(gameFiles).toContain("TestComponent.styles.ts");

      const commonCode = await runProcessAsync("TestComponent", "--common", "--test", "--no-clean");
      expect(commonCode).toEqual(0);
      const commonOutput = getArtifactDirectory("web", "TestComponent");
      const commonFiles = await fs.readdir(commonOutput);
      expect(commonFiles).toContain("TestComponent.tsx");
      expect(commonFiles).toContain("TestComponent.stories.tsx");
      expect(commonFiles).toContain("TestComponent.styles.ts");
    });
  });
});