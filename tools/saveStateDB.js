let mockState = {}

export default {
  readState: {
    description: "Read user save state.",
    run: async ({ userId }) => {
      return mockState[userId] || { zone: 'Desolace', inventory: [] }
    }
  },
  writeState: {
    description: "Write save state.",
    run: async ({ userId, state }) => {
      mockState[userId] = state
      return { success: true, stored: mockState[userId] }
    }
  }
}
