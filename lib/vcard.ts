interface VCardData {
  name: string
  company: string
  title: string
  phone: string
  email: string
  website: string
}

export function generateVCard(data: VCardData): string {
  // N: (nom structuré) = Famille;Prénom;... — requis par la RFC 2426 et
  // mieux interprété par certains parseurs que FN seul.
  const parts = data.name.trim().split(/\s+/)
  const firstName = parts.shift() ?? ''
  const lastName = parts.join(' ')

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${data.name}`,
    `ORG:${data.company}`,
    `TITLE:${data.title}`,
    `TEL:${data.phone}`,
    `EMAIL:${data.email}`,
    `URL:${data.website}`,
    'END:VCARD',
  ].join('\r\n')
}

export function downloadVCard(vcardString: string, filename = 'contact.vcf'): void {
  const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
