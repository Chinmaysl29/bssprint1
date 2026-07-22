// ─── Step Enum ────────────────────────────────────────────────────────────────
export enum Step {
  Welcome = 'WELCOME',
  BasicInfo = 'BASIC_INFO',
  UserType = 'USER_TYPE',

  // Owner branch
  OwnerConfirm = 'OWNER_CONFIRM',
  EmailVerification = 'EMAIL_VERIFICATION',
  OwnerOnboarding = 'OWNER_ONBOARDING',

  // Customer branch
  BookingFor = 'BOOKING_FOR',
  Nationality = 'NATIONALITY',
  IndianDocuments = 'INDIAN_DOCUMENTS',
  ForeignDocuments = 'FOREIGN_DOCUMENTS',
  ReviewInfo = 'REVIEW_INFO',
  Submitted = 'SUBMITTED',
  Pending = 'PENDING',
  CustomerDashboard = 'CUSTOMER_DASHBOARD',
}

// ─── Domain Types ──────────────────────────────────────────────────────────────
export type UserType = 'owner' | 'customer'
export type BookingFor = 'myself' | 'someone_else'
export type Nationality = 'indian' | 'foreign'
export type PurposeOfStay =
  | 'student'
  | 'working_professional'
  | 'internship'
  | 'business'
  | 'tourist'
  | 'research'
  | 'medical'
  | 'others'

export interface MockFile {
  name: string
  size: number
  type: string
  preview?: string
}

export interface IndianDocuments {
  aadhaar: MockFile | null
  pan: MockFile | null
  idType: 'college' | 'employee'
  idFile: MockFile | null
}

export interface ForeignDocuments {
  passport: MockFile | null
  visa: MockFile | null
  purposeOfStay: PurposeOfStay | ''
  purposeOther: string
}

// ─── Central Form Data ─────────────────────────────────────────────────────────
export interface AuthFormData {
  // Basic Info
  fullName: string
  phone: string
  email: string

  // User Type
  userType: UserType | null

  // Customer: Booking For
  bookingFor: BookingFor | null
  guardianName: string

  // Customer: Nationality
  nationality: Nationality | null

  // Customer: Documents
  indianDocs: IndianDocuments
  foreignDocs: ForeignDocuments

  // Owner: OTP
  otp: string
}

// ─── State & Action ────────────────────────────────────────────────────────────
export interface AuthState {
  step: Step
  formData: AuthFormData
  isLoading: boolean
  errors: Partial<Record<keyof AuthFormData | string, string>>
}

export type AuthAction =
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_FORM_DATA'; payload: Partial<AuthFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Partial<Record<string, string>> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET' }
