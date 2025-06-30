export default {
  testSceneOutput: {
    description: 'Mock validation of generated scene HTML',
    run: async ({ html }) => {
      const hasThree = html && html.includes('three')
      const hasScene = html && html.includes('Scene')
      return { passed: hasThree && hasScene }
    }
  }
}
