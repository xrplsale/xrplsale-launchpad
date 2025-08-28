import { getProjects, getProject, getPresaleAnalytics, getPresaleStatus } from '@/lib/api-simple';
import { ProjectCard } from '@/components/features/projects/ProjectCard/ProjectCard';

export default async function ProjectsPage() {
  // Get projects list, XSALE project, and analytics
  const [projects, xsaleProject, presaleStatus, analytics] = await Promise.all([
    getProjects(),
    getProject(0).catch(() => null),
    getPresaleStatus().catch(() => null),
    getPresaleAnalytics().catch(() => null)
  ]);

  // Combine projects list with XSALE project if it exists and isn't already in the list
  const allProjects = [...projects];
  if (xsaleProject && !projects.find(p => p.id === 0)) {
    allProjects.unshift(xsaleProject);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Active Projects</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover and invest in innovative XRPL token projects. All projects are audited and secured with XRPL native escrow.
          </p>
        </div>

        {/* Platform Stats */}
        {(presaleStatus || analytics) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {presaleStatus && (
              <>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <h3 className="text-slate-400 text-sm mb-1">Current Tier</h3>
                  <p className="text-2xl font-bold text-purple-400">{presaleStatus.current_tier}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <h3 className="text-slate-400 text-sm mb-1">Participants</h3>
                  <p className="text-2xl font-bold text-blue-400">{presaleStatus.participants_count}</p>
                </div>
              </>
            )}
            {analytics && (
              <>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <h3 className="text-slate-400 text-sm mb-1">Total Raised</h3>
                  <p className="text-2xl font-bold text-green-400">{analytics.presale_overview.total_raised_xrp.toFixed(2)} XRP</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <h3 className="text-slate-400 text-sm mb-1">Investors</h3>
                  <p className="text-2xl font-bold text-yellow-400">{analytics.presale_overview.total_investors}</p>
                </div>
              </>
            )}
          </div>
        )}

        {allProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-2">No Active Projects</h3>
            <p className="text-slate-400">
              New projects will appear here once they&apos;re launched. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

