export function secureIndex(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) throw new RangeError('Invalid random range')
  const limit = 0x100000000 - (0x100000000 % max)
  const value = new Uint32Array(1)
  do { crypto.getRandomValues(value) } while (value[0] >= limit)
  return value[0] % max
}

export function generatePassword(length: number, uppercase: boolean, numbers: boolean, special: boolean): string {
  const groups = ['abcdefghijklmnopqrstuvwxyz']
  if (uppercase) groups.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  if (numbers) groups.push('0123456789')
  if (special) groups.push('!@#$%^&*()_+-=[]{}|;:,.<>?')
  if (!Number.isInteger(length) || length < Math.max(4, groups.length) || length > 64) throw new RangeError('Invalid password length')
  const alphabet = groups.join('')
  const result = groups.map((group) => group[secureIndex(group.length)])
  while (result.length < length) result.push(alphabet[secureIndex(alphabet.length)])
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureIndex(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result.join('')
}
