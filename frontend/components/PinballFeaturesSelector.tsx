"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Features } from "@/components/object/features"

export type PinballFeatures = {
  playfield: Record<string, boolean>
  game_modes: Record<string, boolean>
  visual_feedback: Record<string, boolean>
  audio: Record<string, boolean>
  electronics: Record<string, boolean>
  connectivity: Record<string, boolean>
  cabinet: Record<string, boolean>
  operator: Record<string, boolean>
  accessibility: Record<string, boolean>
  customization: Record<string, boolean>
  premium: Record<string, boolean>
  maintenance: Record<string, boolean>
}

interface PinballFeaturesSelectorProps {
  features: PinballFeatures
  onChange: (features: PinballFeatures) => void
  readonly?: boolean
}

export function PinballFeaturesSelector({ features, onChange, readonly = false }: PinballFeaturesSelectorProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFeatureChange = (category: keyof PinballFeatures, feature: string, checked: boolean) => {
    if (readonly) return

    const newFeatures = {
      ...features,
      [category]: {
        ...features[category],
        [feature]: checked,
      },
    }
    onChange(newFeatures)
  }

  const getSelectedCount = (category: keyof PinballFeatures) => {
    return Object.values(features[category]).filter(Boolean).length
  }

  const getTotalCount = (category: keyof PinballFeatures) => {
    return Object.keys(Features[category].features).length
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Additional Features & Modifications</h3>
        <Badge variant="outline">
          {Object.values(Features).reduce(
            (total, category) => total + Object.values(category).filter(Boolean).length,
            0,
          )}{" "}
          features selected
        </Badge>
      </div>

      <div className="grid gap-4">
        {Object.entries(Features).map(([categoryKey, categoryData]) => {
          const category = categoryKey as keyof PinballFeatures
          const isOpen = openSections[category]
          const selectedCount = getSelectedCount(category)
          const totalCount = getTotalCount(category)

          return (
            <Card key={category}>
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(category)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <CardTitle className="text-base">{categoryData.title}</CardTitle>
                      </div>
                      <Badge variant={selectedCount > 0 ? "default" : "secondary"}>
                        {selectedCount}/{totalCount}
                      </Badge>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(categoryData.features).map(([featureKey, featureLabel]) => (
                        <div key={featureKey} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category}-${featureKey}`}
                            checked={features[category][featureKey] || false}
                            onCheckedChange={(checked) => handleFeatureChange(category, featureKey, checked as boolean)}
                            disabled={readonly}
                          />
                          <label
                            htmlFor={`${category}-${featureKey}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {featureLabel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Helper function to create initial empty features object
export function createEmptyFeatures(): PinballFeatures {
  const emptyFeatures: PinballFeatures = {} as PinballFeatures

  Object.keys(featureLabels).forEach((category) => {
    emptyFeatures[category as keyof PinballFeatures] = {}
    Object.keys(featureLabels[category as keyof typeof featureLabels].features).forEach((feature) => {
      emptyFeatures[category as keyof PinballFeatures][feature] = false
    })
  })

  return emptyFeatures
}
