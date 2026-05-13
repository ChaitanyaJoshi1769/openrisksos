export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to OpenRiskOS</h1>
        <p className="text-xl text-gray-600 mb-8">
          Enterprise-grade, AI-native GRC platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Risk Management Card */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
            <p className="text-gray-600">
              Identify, quantify, and monitor organizational risks
            </p>
          </div>

          {/* Compliance Card */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Compliance</h3>
            <p className="text-gray-600">
              Manage compliance with 20+ regulatory frameworks
            </p>
          </div>

          {/* Incidents Card */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Incidents</h3>
            <p className="text-gray-600">
              Intake, investigate, and remediate incidents
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 space-x-4">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </a>
          <a
            href="/docs"
            className="inline-block px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Documentation
          </a>
        </div>
      </div>
    </main>
  );
}
