import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats?: {
    label: string;
    value: number;
    color?: 'primary' | 'success' | 'warning';
  };
  isActive?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, stats, isActive = true }: FeatureCardProps) {
  const getStatsColor = () => {
    switch (stats?.color) {
      case 'success':
        return 'bg-gradient-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-gradient-primary text-primary-foreground';
    }
  };

  return (
    <Card className="shadow-soft border-0 transition-all duration-300 hover:shadow-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg">{title}</span>
          </div>
          <Badge variant={isActive ? 'secondary' : 'outline'} className={isActive ? 'bg-success text-success-foreground' : ''}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        {stats && (
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getStatsColor()}`}>
            <span className="font-semibold text-lg">{stats.value.toLocaleString()}</span>
            <span className="text-sm opacity-90">{stats.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}