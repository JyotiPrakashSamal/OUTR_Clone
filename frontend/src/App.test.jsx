import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { supabase } from './supabaseClient'

// Mock Supabase client
vi.mock('./supabaseClient', () => {
  const mockSubscription = { unsubscribe: vi.fn() }
  const mockOnAuthStateChange = vi.fn((callback) => {
    // Invoke INITIAL_SESSION with null session initially
    setTimeout(() => callback('INITIAL_SESSION', null), 0)
    return { data: { subscription: mockSubscription } }
  })

  return {
    supabase: {
      auth: {
        onAuthStateChange: mockOnAuthStateChange,
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
    },
  }
})

describe('App Routing & Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the initial loading state correctly', async () => {
    render(<App />)
    
    // The loading screen should show
    expect(screen.getByText(/Unified Services Portal/i)).toBeInTheDocument()
  })
})
