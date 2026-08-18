// En production sur GitHub Pages, les assets de /public sont servis sous le
// basePath (/carte). Next n'ajoute pas ce préfixe aux <img> bruts, on le fait
// donc manuellement, sinon /logo.png renvoie un 404.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function ProfileHeader() {
  return (
    <div className="relative">
      {/* Bannière dégradée crème + liseré or */}
      <div className="h-40 border-b-2 border-accent bg-gradient-to-br from-banner1 to-banner2" />

      {/* Avatar : logo NP en image, aligné à gauche, débordant */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-6">
        <div className="h-[88px] w-[140px] overflow-hidden rounded-2xl border-4 border-accent bg-[#e8e4e2] shadow-lg">
          <img
            src={`${base}/logo.png`}
            alt="NP IMMOBILIER"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}
