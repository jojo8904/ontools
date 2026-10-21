// Check the actual public production pages without credentials or GitHub API rate limits.
// Commit-specific Vercel status is checked separately in the release record.
const sha = process.env.GITHUB_SHA
if (!sha) throw new Error('Run this check in the existing GitHub Actions pipeline.')
const checks = [['image-split', 'A4 여백'], ['electricity', '히터·온풍기 추가요금과 예산'], ['calorie', '평소 활동량 선택']]
for (let attempt = 0; attempt < 30; attempt++) {
  let ready = true
  for (const [route, marker] of checks) {
    try {
      const page = await fetch(`https://ontools.co.kr/${route}?verify=${sha}`, { signal: AbortSignal.timeout(15000) })
      if (!page.ok || !(await page.text()).includes(marker)) ready = false
    } catch { ready = false }
  }
  if (ready) {
    console.log(`Production feature checks passed; workflow commit ${sha}. Confirm commit-specific Vercel status separately.`)
    process.exit(0)
  }
  console.log(`Waiting for production features; workflow commit ${sha} (${attempt + 1}/30)`)
  await new Promise((resolve) => setTimeout(resolve, 20000))
}
throw new Error('Production features did not become ready within the check window.')
