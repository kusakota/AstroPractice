// src/pages/og/[id].ts のようなファイルパスを想定
import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import kikaku from "../../content/kikaku/kikakuList.json";

// --- アセットの読み込み ---
// 背景画像とフォントファイルをArrayBufferとしてインポートする
import baseImageData from "../../assets/images/Rectangle7.png?arraybuffer";
import fontData from "../../assets/fonts/noto-sans-jp-regular.otf?arraybuffer";

/**
 * ArrayBufferをバイナリ文字列に変換するヘルパー関数
 * (btoaでBase64エンコードするために必要)
 */
function arrayBufferToBinaryString(arrayBuffer: ArrayBuffer): string {
  let binaryString = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
}

// 背景画像をBase64エンコードして、CSSで直接使えるようにしておく
const baseImage = btoa(arrayBufferToBinaryString(baseImageData));

/**
 * getStaticPaths: ビルド時に静的なパスを生成する
 */
export const getStaticPaths: GetStaticPaths = () => {
  return kikaku.map((project) => ({
    params: { id: String(project.project_id) },
    props: { name: project.name },
  }));
};

/**
 * GET: APIエンドポイントの本体
 * propsを受け取り、画像を生成して返す
 */
export const GET: APIRoute = async ({ props }) => {
  if (!props.name) {
    return new Response("Not found", { status: 404 });
  }
  
  // propsから受け取った企画名で画像を生成
  const body = await generateOgImage(props.name);

  // 生成したPNG画像をレスポンスとして返す
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

/**
 * 画像生成のコアロジック
 * @param title 画像に埋め込むタイトル
 * @returns PNG画像のBuffer
 */
async function generateOgImage(title: string): Promise<Buffer> {
  // SatoriでHTML/CSSからSVGを生成
  const svg = await satori(
    html`
      <div
        style="display: flex; width: 1200px; height: 630px; background-size: 1200px 630px; background-image: url(data:image/png;base64,${baseImage});"
      >
        <div
          style="display: flex; justify-content: center; align-items: center; text-align: center; width: 900px; height: 250px; position: absolute; left: 150px; top: 280px; padding: 20px;"
        >
          <p
            style="color: #333; font-size: 60px; font-family: 'Noto Sans JP';"
          >${title}</p>
        </div>
      </div>
    `,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP", // CSSで指定するフォント名
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
  // SharpでSVGをPNGに変換
  return await sharp(Buffer.from(svg)).png().toBuffer();
}