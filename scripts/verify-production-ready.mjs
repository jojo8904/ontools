// Uses the existing, temporary GitHub Actions token; never prints credentials.
const repository = process.env.GITHUB_REPOSITORY
const sha = process.env.GITHUB_SHA
const token = process.env.GH_TOKEN
if (!repository || !sha || !token) throw new Error('Run this check in the existing GitHub Actions pipeline.')
for (let attempt = 0; attempt < 30; attempt++) {
  const response = await fetch(`https://api.github.com/repos/${repository}/commits/${sha}/status`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`GitHub commit status returned ${response.status}`)
  const { statuses } = await response.json()
  const vercel = statuses.find((status) => status.context === 'Vercel')
  if (vercel?.state === 'failure' || vercel?.state === 'error') throw new Error('Vercel deployment failed.')
  if (vercel?.state === 'success') {
    const checks = [['image-split', 'A4 여백'], ['electricity', '히터·온풍기 추가요금과 예산'], ['calorie', '평소 활동량 선택']]
    let ready = true
    for (const [route, marker] of checks) {
      const page = await fetch(`https://ontools.co.kr/${route}?verify=${sha}`)
      if (!page.ok || !(await page.text()).includes(marker)) ready = false
    }
    if (ready) { console.log(`Production ready for ${sha}: ${vercel.target_url}`); process.exit(0) }
  }
  console.log(`Waiting for production commit ${sha} (${attempt + 1}/30)`)
  await new Promise((resolve) => setTimeout(resolve, 20000))
}
throw new Error('Production did not become ready within 10 minutes.')
