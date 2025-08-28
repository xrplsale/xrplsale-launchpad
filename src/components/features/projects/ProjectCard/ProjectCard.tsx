import Link from 'next/link';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ProgressBar } from '@/components/ui';
import { formatXRP, getStatusColor } from '@/lib/utils';
import type { Project } from '@/lib/api-simple';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'featured';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const statusColor = getStatusColor(project.status);

  if (variant === 'compact') {
    return (
      <Link href={`/projects/${project.id}`}>
        <Card hover className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge className={statusColor}>{project.status.toUpperCase()}</Badge>
          </div>
          <ProgressBar 
            value={parseFloat(project.raised_amount) / parseFloat(project.target_amount) * 100} 
            variant="gradient" 
            size="sm" 
            showPercentage 
          />
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/projects/${project.id}`}>
        <Card variant="elevated" hover className="overflow-hidden">
          {/* Featured header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-white/30 text-white">
                    {project.symbol}
                  </Badge>
                </div>
              </div>
              <Badge className={statusColor}>{project.status.toUpperCase()}</Badge>
            </div>
            <p className="text-white/90 mb-4">{project.description}</p>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <ProgressBar 
              value={parseFloat(project.raised_amount) / parseFloat(project.target_amount) * 100} 
              variant="gradient" 
              showPercentage 
              label="Progress" 
              className="mb-4"
            />
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Raised</p>
                <p className="text-lg font-bold text-cyan-400">
                  {formatXRP(parseFloat(project.raised_amount))} XRP
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Price</p>
                <p className="text-lg font-bold text-yellow-400">
                  {project.price_per_token} XRP
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">
                Token: {project.symbol}
              </span>
              <span className="text-purple-400 font-medium">
                View Details →
              </span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover className="overflow-hidden">
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{project.symbol}</Badge>
                <Badge className={statusColor}>{String(project.status).toUpperCase()}</Badge>
              </div>
            </div>
          </div>
          
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-4">
          <ProgressBar 
            value={parseFloat(project.raised_amount) / parseFloat(project.target_amount) * 100} 
            variant="gradient" 
            showPercentage 
            label="Progress"
          />
        </div>

        {/* Stats Grid */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Raised</p>
              <p className="text-lg font-bold text-cyan-400">
                {formatXRP(parseFloat(project.raised_amount))} XRP
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">Price</p>
              <p className="text-lg font-bold text-yellow-400">
                {project.price_per_token} XRP
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">
              Price: {project.price_per_token} XRP
            </span>
            <span className="text-purple-400 font-medium">
              View Details →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}