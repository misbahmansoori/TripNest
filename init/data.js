const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    category: "beach",
    description: "Wake up to the sound of waves in this serene beachfront cottage...",
    image: {
      url: "https://images.unsplash.com/photo-1570127828934-c60aa3e1e5af?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-118.7798, 34.0259]
    }
  },
  {
    title: "Modern Loft in Downtown",
    category: "rooms",
    description: "A sleek, industrial-style loft nestled in the heart of the city...",
    image: {
      url: "https://images.unsplash.com/photo-1704428381412-f748f49eb9a6?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128]
    }
  },
  {
    title: "Mountain Retreat",
    category: "mountains",
    description: "Tucked away in the highlands, this wooden cabin offers breathtaking views...",
    image: {
      url: "https://images.unsplash.com/photo-1595978039051-29c55ea43051?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-106.8175, 39.1911]
    }
  },
  {
    title: "Historic Villa in Tuscany",
    category: "castles",
    description: "Surround yourself with the charm of old-world Italy in this 17th-century villa...",
    image: {
      url: "https://images.unsplash.com/photo-1645550626925-b2265b308686?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696]
    }
  },
  {
    title: "Secluded Treehouse Getaway",
    category: "trending",
    description: "Hidden in the canopy, this handcrafted treehouse offers the perfect escape...",
    image: {
      url: "https://images.unsplash.com/photo-1709869837747-cd22da367fdb?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 800,
    location: "Portland",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231]
    }
  },
  {
    title: "Beachfront Paradise",
    category: "pools",
    description: "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation...",
    image: {
      url: "https://images.unsplash.com/photo-1528913775512-624d24b27b96?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    geometry: {
      type: "Point",
      coordinates: [-86.8515, 21.1619]
    }
  },
  {
    title: "Rustic Cabin by the Lake",
    category: "camping",
    description: "A cozy lakeside cabin with a crackling fire, vintage decor...",
    image: {
      url: "https://images.unsplash.com/photo-1605307800750-6d783a88d248?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-120.0433, 39.0968]
    }
  },
  {
    title: "Luxury Penthouse with City Views",
    category: "iconic",
    description: "Live like royalty in this luxurious penthouse featuring a hot tub...",
    image: {
      url: "https://images.unsplash.com/photo-1609766857326-18a204c2cf31?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-118.2437, 34.0522]
    }
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    category: "mountains",
    description: "This alpine-style chalet is located directly on the slopes...",
    image: {
      url: "https://images.unsplash.com/photo-1575403071235-5dcd06cbf169?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    geometry: {
      type: "Point",
      coordinates: [7.2339, 46.0965]
    }
  },
  {
    title: "Safari Lodge in the Serengeti",
    category: "farms",
    description: "Stay amidst the wild in this eco-friendly safari lodge...",
    image: {
      url: "https://images.unsplash.com/photo-1504643039591-52948e3ddb47?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    geometry: {
      type: "Point",
      coordinates: [34.6857, -2.3333]
    }
  },
  {
    title: "Luxury Villa in the Maldives",
    category: "arctic",
    description: "Indulge in this dreamy overwater villa with direct ocean access...",
    image: {
      url: "https://images.unsplash.com/photo-1590523277760-06f4e9939d1a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "listing_image"
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    geometry: {
      type: "Point",
      coordinates: [73.2207, 3.2028]
    }
  }
];

module.exports = { data: sampleListings };
