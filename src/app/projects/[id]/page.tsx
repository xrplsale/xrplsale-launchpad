import { notFound } from 'next/navigation';
import { getProject } from '@/lib/api-simple';

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;
  
  const project = await getProject(parseInt(id));
  
  if (!project) {
    notFound();
  }

  const progress = (parseFloat(project.raised_amount) / parseFloat(project.target_amount)) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
              <p className="text-xl text-slate-300 mb-6">{project.description}</p>
              
              {/* Progress */}
              <div className="bg-slate-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">
                    {parseFloat(project.raised_amount).toFixed(2)} / {parseFloat(project.target_amount).toFixed(2)} XRP
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-slate-400">
                  {progress.toFixed(1)}% completed
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Project Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-400 text-sm">Token Symbol</p>
                    <p className="text-lg font-semibold">{project.symbol}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Price per Token</p>
                    <p className="text-lg font-semibold">{project.price_per_token} XRP</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Supply</p>
                    <p className="text-lg font-semibold">{project.total_supply}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <p className={`text-lg font-semibold ${
                      project.status === 'live' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {typeof project.status === 'string' ? 
                        project.status.charAt(0).toUpperCase() + project.status.slice(1) : 
                        String(project.status)
                      }
                    </p>
                  </div>
                </div>

                {project.website && (
                  <div className="mt-6">
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Investment Details</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Investment</span>
                  <span className="font-semibold">{project.min_investment} XRP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Investment</span>
                  <span className="font-semibold">{project.max_investment} XRP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Amount</span>
                  <span className="font-semibold">{project.target_amount} XRP</span>
                </div>
              </div>

              {project.status === 'live' && (
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-all">
                  Invest Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}