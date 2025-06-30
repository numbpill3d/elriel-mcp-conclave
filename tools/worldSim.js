let worldState = {
  time: "dawn",
  weather: "hollow mist",
  events: []
}

export default {
  updateWorldState: {
    description: "Modify world time, weather, or global conditions",
    run: async ({ time, weather }) => {
      if (time) worldState.time = time
      if (weather) worldState.weather = weather
      return { updated: true, state: worldState }
    }
  },
  getWorldState: {
    description: "Retrieve the current simulated world status",
    run: async () => worldState
  }
}
