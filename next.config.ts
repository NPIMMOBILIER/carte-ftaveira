const isProd = process.env.NODE_ENV === 'production'
const repoName = 'carte-ftaveira'

const basePath = isProd ? `/${repoName}` : ''

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: { unoptimized: true },
  // Exposé au client pour préfixer le <img> du logo servi depuis /public
  // (Next n'applique pas le basePath aux balises <img> brutes).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
