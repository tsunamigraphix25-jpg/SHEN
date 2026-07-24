import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-shen-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-shen-primary to-shen-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <div>
                <span className="font-bold text-lg">SHEN</span>
                <span className="text-shen-gray-300 text-xs block leading-none">Knowledge Hub</span>
              </div>
            </div>
            <p className="text-shen-gray-300 text-sm leading-relaxed">
              The official publication and knowledge-sharing platform of the Safety, Health and Environment Network.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-shen-accent">Content</h3>
            <ul className="space-y-2 text-sm text-shen-gray-300">
              <li><Link href="/articles" className="hover:text-white transition-colors">Articles</Link></li>
              <li><Link href="/research" className="hover:text-white transition-colors">Research & Publications</Link></li>
              <li><Link href="/newsroom" className="hover:text-white transition-colors">Newsroom</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events & Activities</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Monthly Highlights</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-shen-accent">Community</h3>
            <ul className="space-y-2 text-sm text-shen-gray-300">
              <li><Link href="/contributors" className="hover:text-white transition-colors">Contributors</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-shen-accent">Connect</h3>
            <p className="text-sm text-shen-gray-300 mb-2">Stay connected with SHEN for the latest updates in safety, health, and environmental knowledge.</p>
            <p className="text-sm text-shen-gray-400">contact@shen.org</p>
          </div>
        </div>

        <div className="border-t border-shen-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-shen-gray-400">
            © {new Date().getFullYear()} Safety, Health and Environment Network (SHEN). All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-shen-gray-400">
            <span>Advancing HSE Excellence Through Knowledge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
