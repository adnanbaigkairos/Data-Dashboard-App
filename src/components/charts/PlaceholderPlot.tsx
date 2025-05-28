import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

interface PlaceholderPlotProps {
  title: string;
  message?: string;
}

export function PlaceholderPlot({ title, message }: PlaceholderPlotProps) {
  return (
    <Card className="h-full flex flex-col items-center justify-center bg-muted/30">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <Map className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {message || "This chart type is not yet fully implemented."}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
           Map plots require specific geographic data and libraries.
        </p>
      </CardContent>
    </Card>
  );
}
