import type z from 'zod'
import type { FormConfig, FormState } from './types'
import { useCallback, useState } from 'react'
import { apiClient } from '~/common/apiClient'

function createApiRequest(endpoint: string, method: string = 'POST', headers: Record<string, string> = {}) {
  return (data: Record<string, any>) =>
    apiClient(endpoint, {
      method,
      headers,
      data,
    })
}

function handleFormReset(shouldReset: boolean | undefined, form?: any) {
  if (shouldReset && form) {
    form.reset()
  }
}

function handleSubmissionError(error: any, onError?: (error: any) => void) {
  if (onError) {
    onError(error)
  }
  else {
    console.error('Form submission error:', error)
  }
}

function createInitialFormState(): FormState {
  return {
    isLoading: false,
    isSubmitting: false,
    errors: {},
    touched: {},
  }
}

function mergeFormState(prev: FormState, updates: Partial<FormState>): FormState {
  return {
    ...prev,
    ...updates,
  }
}

function createStateUpdater(setState: React.Dispatch<React.SetStateAction<FormState>>, onChange?: (state: FormState) => void) {
  return (updates: Partial<FormState>) => {
    setState((prev) => {
      const newState = mergeFormState(prev, updates)
      onChange?.(newState)
      return newState
    })
  }
}

export function useFormState(onFormStateChange?: (state: FormState) => void) {
  const [formState, setFormState] = useState<FormState>(createInitialFormState)
  const updateFormState = useCallback(createStateUpdater(setFormState, onFormStateChange), [onFormStateChange])

  return { formState, updateFormState }
}

export function useFormSubmission<T extends z.ZodType>(config: FormConfig<T>, updateFormState: (updates: Partial<FormState>) => void, form?: any) {
  const handleSubmit = useCallback(async (data: Record<string, any>) => {
    updateFormState({ isSubmitting: true })

    try {
      if (config.onSubmit) {
        await config.onSubmit(data)
      }
      else if (config.endpoint) {
        const apiRequest = createApiRequest(config.endpoint, config.method, config.headers)
        await apiRequest(data)
      }

      handleFormReset(config.resetOnSubmit, form)
    }
    catch (error) {
      handleSubmissionError(error, config.onError)
    }
    finally {
      updateFormState({ isSubmitting: false })
    }
  }, [config, updateFormState, form])

  return { handleSubmit }
}
