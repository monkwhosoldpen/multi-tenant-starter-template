import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-[300px]">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 