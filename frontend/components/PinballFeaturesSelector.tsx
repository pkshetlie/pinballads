"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { getFeatureLabels, getCategoryLabels, createEmptyFeatures } from "@/lib/pinball-feature-labels"
import type { PinballFeatures } from "@/lib/pinball-feature-labels"

interface PinballFeaturesSelectorProps {
  features: PinballFeatures
  onChange: (features: PinballFeatures) => void
  readonly?: boolean
  language?: string // Added language prop
}

export function PinballFeaturesSelector({
                                          features,
                                          onChange,
                                          readonly = false,
                                          language = "fr",
                                        }: PinballFeaturesSelectorProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const featureLabels = getFeatureLabels(language)
  const categoryLabels = getCategoryLabels(language)

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
    if (!features || !features[category]) return 0
    return Object.values(features[category]).filter(Boolean).length
  }

  const getTotalCount = (category: keyof PinballFeatures) => {
    return Object.keys(featureLabels[category] || {}).length
  }

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {language === "fr"
                ? "Caractéristiques et Modifications Supplémentaires"
                : "Additional Features & Modifications"}
          </h3>
          <Badge variant="outline">
            {features
                ? Object.values(features).reduce(
                    (total, category) => total + (category ? Object.values(category).filter(Boolean).length : 0),
                    0,
                )
                : 0}{" "}
            {language === "fr" ? "caractéristiques sélectionnées" : "features selected"}
          </Badge>
        </div>

        <div className="grid gap-4">
          {Object.entries(featureLabels).map(([categoryKey]) => {
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
                            <CardTitle className="text-base">{categoryLabels[category]}</CardTitle>
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
                          {Object.entries(featureLabels[category] || {}).map(([featureKey, featureLabel]) => (
                              <div key={featureKey} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${category}-${featureKey}`}
                                    checked={features?.[category]?.[featureKey] || false}
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

export { createEmptyFeatures }
