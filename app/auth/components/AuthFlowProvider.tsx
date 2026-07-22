'use client'
import React, {
  createContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import {
  Step,
  type AuthState,
  type AuthAction,
  type AuthFormData,
} from '../types/auth'

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialFormData: AuthFormData = {
  fullName: '',
  phone: '',
  email: '',
  userType: null,
  bookingFor: null,
  guardianName: '',
  nationality: null,
  indianDocs: {
    aadhaar: null,
    pan: null,
    idType: 'college',
    idFile: null,
  },
  foreignDocs: {
    passport: null,
    visa: null,
    purposeOfStay: '',
    purposeOther: '',
  },
  otp: '',
}

const initialState: AuthState = {
  step: Step.Welcome,
  formData: initialFormData,
  isLoading: false,
  errors: {},
}

// ─── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload, errors: {} }
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
export interface AuthFlowContextValue {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  goTo: (step: Step) => void
  setFormData: (data: Partial<AuthFormData>) => void
  setLoading: (v: boolean) => void
  setErrors: (e: Partial<Record<string, string>>) => void
  clearErrors: () => void
}

export const AuthFlowContext = createContext<AuthFlowContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const goTo = useCallback(
    (step: Step) => dispatch({ type: 'SET_STEP', payload: step }),
    []
  )
  const setFormData = useCallback(
    (data: Partial<AuthFormData>) =>
      dispatch({ type: 'SET_FORM_DATA', payload: data }),
    []
  )
  const setLoading = useCallback(
    (v: boolean) => dispatch({ type: 'SET_LOADING', payload: v }),
    []
  )
  const setErrors = useCallback(
    (e: Partial<Record<string, string>>) =>
      dispatch({ type: 'SET_ERRORS', payload: e }),
    []
  )
  const clearErrors = useCallback(
    () => dispatch({ type: 'CLEAR_ERRORS' }),
    []
  )

  return (
    <AuthFlowContext.Provider
      value={{ state, dispatch, goTo, setFormData, setLoading, setErrors, clearErrors }}
    >
      {children}
    </AuthFlowContext.Provider>
  )
}
