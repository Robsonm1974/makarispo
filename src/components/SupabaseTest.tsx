'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-config'

export default function SupabaseTest() {
  const [dbStatus, setDbStatus] = useState<string>('Testando...')
  const [storageStatus, setStorageStatus] = useState<string>('Testando...')
  const [tenantCount, setTenantCount] = useState<number>(0)
  const [schoolCount, setSchoolCount] = useState<number>(0)
  const [eventCount, setEventCount] = useState<number>(0)
  const [participantCount, setParticipantCount] = useState<number>(0)
  const [productCount, setProductCount] = useState<number>(0)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Teste do banco de dados
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .limit(1)

      if (tenantError) {
        setDbStatus('❌ Erro: ' + tenantError.message)
      } else {
        setDbStatus('✅ Conectado')
        setTenantCount(tenantData?.length || 0)
      }

      // Teste do storage
      const { error: storageError } = await supabase
        .storage
        .listBuckets()

      if (storageError) {
        setStorageStatus('❌ Erro: ' + storageError.message)
      } else {
        setStorageStatus('✅ Conectado')
      }

      // Contadores
      const { count: schools } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true })

      const { count: events } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })

      const { count: participants } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })

      const { count: products } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      setSchoolCount(schools || 0)
      setEventCount(events || 0)
      setParticipantCount(participants || 0)
      setProductCount(products || 0)

    } catch (error) {
      console.error('Erro no teste:', error)
      setDbStatus('❌ Erro inesperado')
      setStorageStatus('❌ Erro inesperado')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🔍 Teste de Conexão Supabase</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status das Conexões */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📡 Status das Conexões</h3>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Banco de Dados:</span>
            <span className={dbStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
              {dbStatus}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Storage:</span>
            <span className={storageStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
              {storageStatus}
            </span>
          </div>
        </div>

        {/* Contadores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📊 Dados do Tenant</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{tenantCount}</div>
              <div className="text-sm text-gray-600">Tenants</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="text-2xl font-bold text-green-600">{schoolCount}</div>
              <div className="text-sm text-gray-600">Escolas</div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded text-center">
              <div className="text-2xl font-bold text-yellow-600">{eventCount}</div>
              <div className="text-sm text-gray-600">Eventos</div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded text-center">
              <div className="text-2xl font-bold text-purple-600">{participantCount}</div>
              <div className="text-sm text-gray-600">Participantes</div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-2xl font-bold text-orange-600">{productCount}</div>
              <div className="text-sm text-gray-600">Produtos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={testConnection}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Testar Novamente
        </button>
      </div>
    </div>
  )
}
