"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedButton } from "@/components/animated-button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Profile {
  id: string
  username: string
  avatar_url: string
  rating_blitz: number
}

interface RatingHistory {
  id: string
  user_id: string
  rating: number
  created_at: string
}

interface ProfilePageProps {
  profile: Profile
  ratingHistory: RatingHistory[]
}

export function ProfilePage({ profile, ratingHistory }: ProfilePageProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, you would upload the file to Supabase Storage here
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  })

  // Format rating history data for the chart
  const chartData = ratingHistory.map((entry) => ({
    date: new Date(entry.created_at).toLocaleDateString(),
    rating: entry.rating,
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="md:col-span-1 bg-chainBg/60 backdrop-blur-sm border-chain1/20">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                {...getRootProps()}
                className={`relative h-32 w-32 rounded-full overflow-hidden cursor-pointer border-2 ${
                  isDragActive ? "border-chain1" : "border-gray-700"
                }`}
              >
                <input {...getInputProps()} />
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={profile?.username} />
                  <AvatarFallback className="text-3xl">{profile?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-400">Click or drag to upload avatar</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={profile?.username} />
              </div>

              <div className="pt-4">
                <AnimatedButton className="w-full">Save Changes</AnimatedButton>
              </div>

              <div className="pt-2">
                <AnimatedButton variant="outline" className="w-full">
                  Mint Profile as NFT
                </AnimatedButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-chainBg/60 backdrop-blur-sm border-chain1/20">
          <CardHeader>
            <CardTitle>Rating History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D0E1C",
                      borderColor: "#333",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="url(#ratingGradient)"
                    strokeWidth={2}
                    dot={{ fill: "#00E3FF", r: 4 }}
                    activeDot={{ r: 6, fill: "#7353FF" }}
                  />
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00E3FF" />
                      <stop offset="100%" stopColor="#7353FF" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
