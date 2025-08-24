import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

function App() {
  const [name, setName] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Tailwind + ShadCN Test 🚀
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full" onClick={() => alert(`Hello, ${name || "World"}!`)}>
            Say Hello
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
