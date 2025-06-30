import bugScanner from './scanForBugsAndConflicts.js'

export default {
  recommendBugFixesFromLogs: {
    description: 'Recommend fixes for issues detected by scanForBugsAndConflicts',
    run: async () => {
      const results = await bugScanner.scanForBugsAndConflicts.run()
      return results.map(r => `Fix ${r.issue} in ${r.file}`)
    }
  }
}
