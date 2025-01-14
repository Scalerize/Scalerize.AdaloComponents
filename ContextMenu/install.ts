import { copy } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

const projectPath: string = Deno.env.get("ADALO_APP_PROJECT_PATH") || "";
const platform = Deno.env.get("ADALO_APP_PLATFORM");

// Copy MaterialIcons fonts
const fontsSource = join(projectPath, "node_modules/react-native-vector-icons/Fonts");
if (platform === "ios") {
  // Copy to iOS resources
  const iosFontsDest = join(projectPath, "ios/Fonts");
  await Deno.mkdir(iosFontsDest, { recursive: true });
  for await (const entry of Deno.readDir(fontsSource)) {
    if (entry.isFile) {
      await copy(join(fontsSource, entry.name), join(iosFontsDest, entry.name), { overwrite: true });
    }
  }
} else if (platform === "android") {
  // Copy to Android assets
  const androidFontsDest = join(projectPath, "android/app/src/main/assets/fonts");
  await Deno.mkdir(androidFontsDest, { recursive: true });
  for await (const entry of Deno.readDir(fontsSource)) {
    if (entry.isFile) {
      await copy(join(fontsSource, entry.name), join(androidFontsDest, entry.name), { overwrite: true });
    }
  }
}