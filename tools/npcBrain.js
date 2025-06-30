let npcBrains = {}

export default {
  generateNPCBrain: {
    description: "Create a basic NPC behavior object from input personality",
    run: async ({ name, personality }) => {
      npcBrains[name] = {
        name,
        personality,
        goals: [],
        memory: [],
        location: "unknown"
      }
      return npcBrains[name]
    }
  },
  getNPCBrain: {
    description: "Get the stored brain state of an NPC",
    run: async ({ name }) => npcBrains[name] || { error: "NPC not found" }
  }
}
