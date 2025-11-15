import Browser from 'webextension-polyfill'

export default defineBackground({
  type: 'module',
  main() {
    Browser.omnibox.onInputChanged.addListener((text, suggest) => {
      Browser.omnibox.setDefaultSuggestion({
        description: text
          || ((!import.meta.env.CHROME)
            ? '<Enter Search Keywords>'
            : '&lt;Enter Search Keywords&gt;'),
      })

      if (text.length < 2 || text.length > 64) {
        return
      }

      getSearchResult(text)
        .then(suggest)
    })

    async function getSearchResult(text: string):
    Promise<Browser.Omnibox.SuggestResult[]> {
      const headers = new Headers({ Accept: 'application/json' })
      const init = { method: 'GET', headers }
      const url = `https://registry.npmjs.com/-/v1/search?text=${text}&size=10`
      const request = new Request(url, init)

      const response = await fetch(request)
      if (response.status !== 200) {
        return []
      }

      const searchResult: SearchResult = await response.json()

      const result = searchResult.objects.map((data) => {
        return {
          content: data.package.links.npm,
          description: data.package.description
            ? `${data.package.name} - ${escapeHtml(data.package.description)}`
            : data.package.name,
        }
      })

      return result
    }

    interface SearchResult {
      readonly objects: {
        readonly package: {
          readonly name: string
          readonly version: string
          readonly description?: string
          readonly keywords: string[]
          readonly date: string
          readonly links: {
            readonly npm: string
            readonly homepage?: string
            readonly repository?: string
            readonly bugs?: string
          }
          readonly publisher: {
            readonly email: string
            readonly username: string
          }
          readonly maintainers: {
            readonly email: string
            readonly username: string
          }[]
          readonly license?: string
        }
        readonly score: {
          readonly final: number
          readonly detail: {
            readonly quality: number
            readonly popularity: number
            readonly maintenance: number
          }
        }
        readonly searchScore: number
        readonly downloads: {
          readonly monthly: number
          readonly weekly: number
        }
        readonly dependents: number
      }[]
      readonly total: number
      readonly time: string
    }

    Browser.omnibox.onInputEntered.addListener((text, disposition) => {
      if (!text) {
        return
      }

      const url = isNpmURL(text) ? text : `https://www.npmjs.com/search?q=${text}`

      switch (disposition) {
        case 'currentTab':
          Browser.tabs.update({ url })
          break
        case 'newForegroundTab':
          Browser.tabs.create({ url })
          break
        case 'newBackgroundTab':
          Browser.tabs.create({ url, active: false })
          break
      }
    })

    function isNpmURL(text: string): boolean {
      let url: URL

      try {
        url = new URL(text)
      }
      catch {
        return false
      }

      return url.protocol === 'https:'
        && !url.username
        && !url.password
        && url.hostname === 'www.npmjs.com'
        && !url.port
        && url.pathname.startsWith('/package/')
        && !url.hash
        && !url.search
    }

    function escapeHtml(text: string): string {
      return text.replace(/[&<>]/g, (match) => {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[match] || match
      })
    }
  },
})
