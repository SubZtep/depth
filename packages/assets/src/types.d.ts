type AssetCategory = "terrain" | "model" | "generative"

interface AssetData {
  id: string
  name: string
  category: AssetCategory[]
}

type AssetsData = AssetData[]
