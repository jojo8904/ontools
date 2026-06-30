import { createClient } from '@supabase/supabase-js'

// env가 없어도 빌드가 죽지 않도록 방어. 실제 값이 없으면 placeholder로 생성되고,
// 쿼리는 실패하지만 각 서비스의 try/catch가 빈 결과로 처리(유튜브 등 부가 기능만 비게 됨).
// 프로덕션(Vercel)에는 실제 env가 주입되므로 정상 동작.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
