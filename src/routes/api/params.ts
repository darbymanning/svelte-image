import { readFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";
import type { RequestHandler } from "@sveltejs/kit";
import type { FormatEnum } from "sharp";

async function optimiseAndSaveImage(filename: string, format: keyof FormatEnum, outputFull: string, width?: number) {
  const buffer = readFileSync(resolve("static", filename));
  await sharp(buffer)
    .resize(width || null)
    .toFormat(format)
    .toFile(outputFull);
}

function getOutputPath(filename: string, format: keyof FormatEnum, outputFolder: string, width?: number) {
  let name = filename.split(".").slice(0, -1).join(".");
  if (width) name += `__${width}`;
  return `${outputFolder}/${name}.${format}`;
}

export const get: RequestHandler = async (payload) => {
  return {
    body: {
      searchParamsString: payload.url.searchParams.toString(),
    },
  };

  const { url } = payload;

  const [filename, format, width] = [
    url.searchParams.get("file"),
    url.searchParams.get("format") as unknown as keyof FormatEnum,
    Number(url.searchParams.get("width")),
  ];

  if (!filename) {
    return {
      body: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    };
  }

  const outputFolder = resolve(`.svelte-kit/output/client/_app/assets/cache/images/${filename}`);
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder, { recursive: true });
  }

  const outputPath = getOutputPath(filename, format, outputFolder, width);

  if (!existsSync(outputPath)) {
    await optimiseAndSaveImage(filename, format, outputPath, width);
  }

  return {
    body: readFileSync(outputPath),
  };
};
