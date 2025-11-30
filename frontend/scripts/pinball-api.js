const fs = require("fs").promises
const path = require("path")

// Mock API endpoint - replace with real API when available
const PINBALL_API_URL = "https://api.pinballmarket.com/machines"

// Fallback JSON data
const fallbackData = {
  machines: [
    {
      id: 1,
      title: "Medieval Madness",
      manufacturer: "Williams",
      year: 1997,
      price: 8500,
      location: "Los Angeles, CA",
      image: "/medieval-madness-pinball-machine.jpg",
      rating: 4.8,
      condition: "Excellent",
      distance: "5 miles",
      description:
        "Classic medieval-themed pinball machine in excellent condition. All original parts, LED upgrades installed.",
      seller: {
        name: "John Smith",
        rating: 4.9,
        location: "Los Angeles, CA",
      },
    },
    {
      id: 2,
      title: "Attack from Mars",
      manufacturer: "Bally",
      year: 1995,
      price: 7200,
      location: "Chicago, IL",
      image: "/attack-from-mars-pinball-machine.jpg",
      rating: 4.7,
      condition: "Very Good",
      distance: "12 miles",
      description: "Iconic sci-fi themed machine with great gameplay. Recently serviced and cleaned.",
      seller: {
        name: "Sarah Johnson",
        rating: 4.8,
        location: "Chicago, IL",
      },
    },
    {
      id: 3,
      title: "The Twilight Zone",
      manufacturer: "Bally",
      year: 1993,
      price: 6800,
      location: "New York, NY",
      image: "/twilight-zone-pinball-machine.jpg",
      rating: 4.9,
      condition: "Excellent",
      distance: "8 miles",
      description: "Rare and highly sought-after machine based on the classic TV series. Fully restored.",
      seller: {
        name: "Mike Wilson",
        rating: 5.0,
        location: "New York, NY",
      },
    },
  ],
}

async function fetchPinballData() {
  try {
    // Try to fetch from API first
    const response = await fetch(PINBALL_API_URL)

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error(`API returned status: ${response.status}`)
    }
  } catch (error) {
    // Use fallback data
    return fallbackData
  }
}

async function savePinballData() {
  try {
    const data = await fetchPinballData()

    // Save to JSON file for use in the app
    const outputPath = path.join(process.cwd(), "public", "data", "pinball-machines.json")

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    // Write data to file
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2))

    return data
  } catch (error) {
    throw error
  }
}

// Run the script
savePinballData()
  .then(() => {
  })
  .catch((error) => {
    process.exit(1)
  })
