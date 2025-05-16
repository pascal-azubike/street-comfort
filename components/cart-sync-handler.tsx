'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/store/use-cart'

export function CartSyncHandler() {
  const { data: session, status } = useSession()
  const { mergeWithDatabaseCart } = useCart()

  useEffect(() => {
    const syncCart = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          await mergeWithDatabaseCart()
        } catch (error) {
          console.error('Failed to sync cart:', error)
        }
      }
    }

    syncCart()
  }, [status, session, mergeWithDatabaseCart])

  return null
}
