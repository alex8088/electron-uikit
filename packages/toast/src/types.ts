export type ToastType = 'text' | 'loading' | 'success' | 'failed'

export type ToastLoadingFn = {
  /**
   * Toggle loading toast to success status.
   */
  success: (text: string, duration?: number) => void
  /**
   * Toggle loading toast to failed state.
   */
  fail: (text: string, duration?: number) => void
  /**
   * Dismiss loading toast.
   */
  dismiss: () => void
}
