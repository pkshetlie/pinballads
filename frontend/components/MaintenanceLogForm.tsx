"use client"

import {useState} from "react"
import {Plus, Trash2} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {CreateMaintenanceEntryDto, MaintenanceEntry, MaintenanceType} from "@/components/object/MaintenanceDto";
import {maintenanceSuggestions} from "@/components/object/MaintenanceSuggestion";
import {useLanguage} from "@/lib/language-context";
import {PinballDto} from "@/components/object/PinballDto";

interface MaintenanceLogFormProps {
    machine: PinballDto
    onAddEntry: (entry: MaintenanceEntry) => void
    onDeleteEntry: (entry: MaintenanceEntry) => void
    isLoading?: boolean
}

export function MaintenanceLogForm({
                                       machine,
                                       onAddEntry,
                                       onDeleteEntry,
                                       isLoading = false,
                                   }: MaintenanceLogFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState<MaintenanceEntry>({
        id:null,
        date: new Date().toISOString().split("T")[0],
        type: MaintenanceType.cleaning,
        description: "",
        cost: undefined,
        notes: "",
    })
    const [showSuggestions, setShowSuggestions] = useState(false)
    const {t} = useLanguage();
    const handleSubmit = () => {
        if (!formData.description.trim()) {
            alert("Veuillez entrer une description")
            return
        }

        onAddEntry(formData)
        setFormData({
            id:null,
            date: new Date().toISOString().split("T")[0],
            type: MaintenanceType.cleaning,
            description: "",
            cost: undefined,
            notes: "",
        })
        setIsOpen(false)
    }

    const currentSuggestions = maintenanceSuggestions[formData.type] || []

    return (
        <div className="space-y-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2 w-full cursor-pointer">
                        <Plus className="w-4 h-4"/>
                        {t('maintenance.addButton')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('maintenance.dialogTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('maintenance.dialogDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maintenance-date">{t('maintenance.date')}</Label>
                                <Input
                                    id="maintenance-date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({...formData, date: e.target.value})
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maintenance-type">{t('maintenance.type')}</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            type: value as CreateMaintenanceEntryDto["type"],
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(MaintenanceType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {t(`maintenance.${type}.title`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maintenance-description">{t('maintenance.description')}</Label>
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className="text-xs text-primary hover:underline cursor-pointer"
                                >
                                    {showSuggestions ? t('maintenance.hideSuggestions') : t('maintenance.showSuggestions')}
                                </button>
                            </div>

                            <Textarea
                                id="maintenance-description"
                                placeholder={t('maintenance.descriptionPlaceholder')}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({...formData, description: e.target.value})
                                }
                                rows={3}
                            />

                            {showSuggestions && currentSuggestions.length > 0 && (
                                <div className="border rounded-lg p-3 bg-muted space-y-2">
                                    <p className="text-sm font-medium">{t('maintenance.suggestions')} :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {currentSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        description: t(`maintenance.${formData.type}.suggestions.${suggestion}`),
                                                    })
                                                }
                                                className="cursor-pointer text-xs px-2 py-1 bg-background border rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {t(`maintenance.${formData.type}.suggestions.${suggestion}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maintenance-cost">{t('maintenance.cost')}</Label>
                                <Input
                                    id="maintenance-cost"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.cost || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cost: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maintenance-technician">{t('maintenance.replacedParts')}</Label>
                                <Input
                                    id="maintenance-technician"
                                    placeholder={t('maintenance.replacedPartsPlaceholder')}
                                    value={formData.parts?.join(", ") || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            parts: e.target.value
                                                .split(",")
                                                .map((p) => p.trim())
                                                .filter((p) => p),
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maintenance-notes">{t('maintenance.additionalNotes')}</Label>
                            <Textarea
                                id="maintenance-notes"
                                placeholder=""
                                value={formData.notes || ""}
                                onChange={(e) =>
                                    setFormData({...formData, notes: e.target.value})
                                }
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                            className="cursor-pointer"
                        >
                            {t('cancel')}
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="cursor-pointer">
                            {t('add')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {machine.maintenanceLogs.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3">
                        <h4 className="font-semibold text-sm">{t('maintenance.history')}</h4>
                    </div>
                    <div className="divide-y max-h-96 overflow-y-auto">
                        {machine.maintenanceLogs
                            .sort(
                                (a, b) =>
                                    new Date(b.date).getTime() - new Date(a.date).getTime()
                            )
                            .map((entry, key) => (
                                <div key={key} className="p-3 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium">
                                                  {t(`maintenance.${entry.type}.title`)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {new Date(entry.date).toLocaleDateString("fr-FR")}
                                                </span>
                                            </div>
                                            <i className="text-sm text-foreground font-light">
                                                {entry.description}
                                            </i>
                                            {(entry.cost ||
                                                entry.parts?.length ||
                                                entry.notes) && (
                                                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                                    {entry.cost && <div>Coût: ${entry.cost.toFixed(2)}</div>}
                                                    {entry.parts?.length && (
                                                        <div>Pièces: {entry.parts.join(", ")}</div>
                                                    )}
                                                    {entry.notes && <div>Notes: {entry.notes}</div>}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteEntry(entry)}
                                            className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    )
}
