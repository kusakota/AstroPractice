import type { APIRoute, GetStaticPaths } from "astro";
import fs from "fs";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

// Google Fontsからフォントを非同期で取得
async function getFontData() {
  const response = await fetch(
    "https://fonts.gstatic.com/s/notosansjp/v52/-F6pfjtqLzI2JPCgQBnw7HFq.woff2"
  );
  return response.arrayBuffer();
}

const fontDataPromise = getFontData();

// JSONファイルのパス
const jsonPath = new URL("../../src/content/kikaku/kikakuList.json", import.meta.url);

type Kikaku = {
  project_id: number;
  name: string;
  description: string;
  // 他に必要なプロパティがあれば追加
};

export const getStaticPaths: GetStaticPaths = () => {
  const kikakuList: Kikaku[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  return kikakuList.map((kikaku) => ({
    params: { id: String(kikaku.project_id) },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const fontData = await fontDataPromise; // フォントデータを待つ
  const { id } = params;

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  const kikakuList: Kikaku[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const kikaku = kikakuList.find((item) => String(item.project_id) === id);

  if (!kikaku) {
    return new Response("Not Found", { status: 404 });
  }

  const template = html`
    <div
      style="width: ${WIDTH}px; height: ${HEIGHT}px; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f8f9fa; color: #343a40; font-family: 'Noto Sans JP'; padding: 60px;"
    >
      <h1 style="font-size: 72px; margin: 0; text-align: center; line-height: 1.2;">
        ${kikaku.name}
      </h1>
      <p style="font-size: 36px; margin-top: 30px; text-align: center; line-height: 1.5; opacity: 0.8;">
        ${kikaku.description}
      </p>
    </div>
  `;

  const svg = await satori(template, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(pngBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
};