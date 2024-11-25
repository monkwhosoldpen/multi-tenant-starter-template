import { Goat } from "@/lib/types/goat";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface GoatCardProps {
  goat: Goat;
  onClick: (goat: Goat) => void;
}

export function GoatCard({ goat, onClick }: GoatCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(goat)}
    >
      <CardHeader className="relative p-0">
        <div className="h-32 w-full relative">
          <img 
            src={goat.cover_url} 
            alt={goat.username}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <Avatar className="h-20 w-20 absolute -bottom-10 left-4 border-4 border-white">
          <AvatarImage src={goat.img_url} />
          <AvatarFallback>{goat.username[0]}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="pt-12 pb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {goat.metadata_with_translations.name.english}
            </h3>
            {goat.verified && (
              <Badge variant="secondary">Verified</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {goat.metadata_with_translations.bio.english}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">{goat.category}</Badge>
            <Badge variant="outline">
              {goat.subgroups_count || 0} subgroups
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 