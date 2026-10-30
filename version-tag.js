/**
 * Reusable version tag with a build-details popover.
 *
 * Drop into another app: include version-tag.css, load build-info.js (or pass buildIso),
 * then call initVersionTag({ root, version, buildIso, changelogUrl, strings }).
 *
 * strings.updatedLabel — e.g. "Updated" / "Bijgewerkt"
 * strings.changelogLabel — link text (same target as your existing changelog URL)
 * strings.tagAria — include "{v}" for the version number, e.g. "Version {v}, show update details"
 */
const formatBuildTimeAmsterdam = (iso) => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(date)
  const pick = (type) => parts.find((p) => p.type === type)?.value ?? ''
  return `${pick('day')}-${pick('month')}-${pick('year')} ${pick('hour')}:${pick('minute')} ${pick('timeZoneName')}`.trim()
}

const initVersionTag = ({ root, version, buildIso, changelogUrl, strings }) => {
  if (!root) return { update () {} }

  root.classList.add('version-tag')
  const panelId = `${root.id || 'version-tag'}-panel`

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'version-tag-button'
  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-controls', panelId)

  const popover = document.createElement('div')
  popover.className = 'version-tag-popover'
  popover.id = panelId
  popover.hidden = true
  popover.setAttribute('role', 'dialog')
  popover.setAttribute('aria-modal', 'false')

  const updatedRow = document.createElement('p')
  updatedRow.className = 'version-tag-updated'
  const updatedLabel = document.createElement('span')
  updatedLabel.className = 'version-tag-updated-label'
  const updatedTime = document.createElement('time')
  updatedRow.append(updatedLabel, document.createTextNode(' '), updatedTime)

  const changelog = document.createElement('a')
  changelog.className = 'version-tag-changelog'
  changelog.target = '_blank'
  changelog.rel = 'noopener'

  popover.append(updatedRow, changelog)
  root.append(button, popover)

  let open = false
  const setOpen = (next) => {
    open = next
    popover.hidden = !open
    button.setAttribute('aria-expanded', String(open))
  }
  const close = () => setOpen(false)

  button.addEventListener('click', (e) => {
    e.stopPropagation()
    setOpen(!open)
  })

  document.addEventListener('click', (e) => {
    if (!open) return
    if (e.target.closest('.version-tag') === root) return
    close()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !open) return
    close()
    button.focus()
    e.stopPropagation()
    e.preventDefault()
  }, true)

  const apply = ({ version: v, buildIso: iso, changelogUrl: url, strings: s }) => {
    const ver = v ?? version
    const stamp = iso !== undefined ? iso : buildIso
    const href = url ?? changelogUrl
    const copy = s ?? strings
    button.textContent = `v${ver}`
    button.setAttribute('aria-label', (copy.tagAria || 'Version {v}').replace('{v}', ver))
    popover.setAttribute('aria-label', copy.tagAria ? copy.tagAria.replace('{v}', ver) : `v${ver}`)
    updatedLabel.textContent = copy.updatedLabel || 'Updated'
    const formatted = formatBuildTimeAmsterdam(stamp)
    if (formatted) {
      updatedTime.dateTime = stamp
      updatedTime.textContent = formatted
      updatedTime.hidden = false
    } else {
      updatedTime.removeAttribute('datetime')
      updatedTime.textContent = ''
      updatedTime.hidden = true
    }
    changelog.href = href
    changelog.textContent = copy.changelogLabel || 'Changelog'
  }

  apply({ version, buildIso, changelogUrl, strings })

  return {
    update (opts) {
      apply(opts)
    },
    close,
  }
}
