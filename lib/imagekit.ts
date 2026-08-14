import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy",
});

export default imagekit;

export function getImageKitUrl(
  path: string,
  transformations?: Array<Record<string, string | number>>
): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return imagekit.url({
    path,
    transformation: transformations,
  });
}

export function getBlurPlaceholder(url: string): string {
  if (!url) return "";
  // ImageKit blur-up placeholder
  return `${url}?tr=w-20,q-10,bl-10`;
}
