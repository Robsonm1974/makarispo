import SupabaseTest from '@/components/SupabaseTest'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          🚀 PHOTOMANAGER V2
        </h1>
        <SupabaseTest />
      </div>
    </div>
  )
}