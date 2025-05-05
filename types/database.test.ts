import { Database } from './database'

describe('Supabase Database Types', () => {
  it('challenges Row type should match Insert and Update', () => {
    const row: Database['public']['Tables']['challenges']['Row'] = {
      id: '1',
      challenger_id: 'c1',
      challenged_id: 'c2',
      game_mode_id: 1,
      status: 'pending',
      game_id: null,
      expires_at: '2025-01-01T00:00:00Z',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }
    const insert: Database['public']['Tables']['challenges']['Insert'] = row
    const update: Database['public']['Tables']['challenges']['Update'] = row
    expect(insert).toBeDefined()
    expect(update).toBeDefined()
  })

  it('games Row type should match Insert and Update', () => {
    const row: Database['public']['Tables']['games']['Row'] = {
      id: 'g1',
      white_id: 'w1',
      black_id: 'b1',
      time_control: '5+0',
      fen_position: null,
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }
    const insert: Database['public']['Tables']['games']['Insert'] = row
    const update: Database['public']['Tables']['games']['Update'] = row
    expect(insert).toBeDefined()
    expect(update).toBeDefined()
  })

  it('profiles Row type should match Insert and Update', () => {
    const row: Database['public']['Tables']['profiles']['Row'] = {
      id: 'p1',
      username: 'test',
      avatar_url: null,
      updated_at: null,
    }
    const insert: Database['public']['Tables']['profiles']['Insert'] = row
    const update: Database['public']['Tables']['profiles']['Update'] = row
    expect(insert).toBeDefined()
    expect(update).toBeDefined()
  })

  it('game_modes Row type should match Insert and Update', () => {
    const row: Database['public']['Tables']['game_modes']['Row'] = {
      id: 1,
      name: 'Standard',
      description: null,
      created_at: '2025-01-01T00:00:00Z',
    }
    const insert: Database['public']['Tables']['game_modes']['Insert'] = row
    const update: Database['public']['Tables']['game_modes']['Update'] = row
    expect(insert).toBeDefined()
    expect(update).toBeDefined()
  })
})
