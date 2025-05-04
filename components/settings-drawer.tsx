"use client"

import { useState } from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedButton } from "@/components/animated-button"
import { Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

const themes = ["neo", "glass", "wood"]
const pieceStyles = ["standard", "neon", "pixel"]

export function SettingsDrawer() {
  const [theme, setTheme] = useState("neo")
  const [pieceStyle, setPieceStyle] = useState("standard")
  const [volume, setVolume] = useState(50)
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <AnimatedButton variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </AnimatedButton>
      </DrawerTrigger>
      <DrawerContent className="bg-chainBg/95">
        <div className="mx-auto w-full max-w-sm">
          <Tabs defaultValue="board" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="pieces">Pieces</TabsTrigger>
              <TabsTrigger value="sound">Sound</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Board Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((t) => (
                  <ThemeCard key={t} name={t} isSelected={theme === t} onClick={() => setTheme(t)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pieces" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Piece Style</h3>
              <RadioGroup value={pieceStyle} onValueChange={setPieceStyle}>
                {pieceStyles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <RadioGroupItem value={style} id={style} />
                    <Label htmlFor={style} className="capitalize">
                      {style}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>

            <TabsContent value="sound" className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Sound Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">Sound Enabled</Label>
                  <Switch id="sound-enabled" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <span>{volume}%</span>
                  </div>
                  <Slider
                    id="volume"
                    disabled={!soundEnabled}
                    min={0}
                    max={100}
                    step={1}
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface ThemeCardProps {
  name: string
  isSelected: boolean
  onClick: () => void
}

function ThemeCard({ name, isSelected, onClick }: ThemeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-chain1" : "hover:bg-white/5"}`}
      onClick={onClick}
    >
      <CardContent className="p-2">
        <div
          className="h-20 w-full rounded-md"
          style={{
            background:
              name === "neo"
                ? "linear-gradient(45deg, #2d2d2d 25%, #3d3d3d 25%, #3d3d3d 50%, #2d2d2d 50%, #2d2d2d 75%, #3d3d3d 75%, #3d3d3d 100%)"
                : name === "glass"
                  ? "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.2) 100%)"
                  : "url(/bg/wood.jpg)",
            backgroundSize: "20px 20px",
          }}
        />
        <p className="mt-2 text-center text-sm capitalize">{name}</p>
      </CardContent>
    </Card>
  )
}
