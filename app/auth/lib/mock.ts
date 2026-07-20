// ─── Mock async helpers ────────────────────────────────────────────────────────
// TODO: wire to backend — replace each with real API/Supabase calls

export async function mockSendOtp(_email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 1200))
  // Simulated success — backend would send a real OTP email
}

export async function mockVerifyOtp(
  _email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 1000))
  // Accept any 6-digit code for demo purposes (except "000000")
  if (otp === '000000') {
    return { success: false, message: 'Invalid code. Please try again.' }
  }
  return { success: true, message: 'Email verified successfully.' }
}

export async function mockSubmitVerification(
  _formData: unknown
): Promise<void> {
  await new Promise((r) => setTimeout(r, 1800))
  // Simulated submission
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
