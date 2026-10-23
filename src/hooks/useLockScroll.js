/**
 * useLockScroll - Kunci scrollbar dokumen selama layar 1-viewport aktif.
 * Dipakai Modul 2 & Modul 3 agar tidak ada scrollbar tersisa; kelas dilepas
 * otomatis saat komponen unmount sehingga modul lain tetap bisa scroll.
 */

import { useEffect } from 'react'

export const useLockScroll = () => {
  useEffect(() => {
    const { documentElement: html, body } = document
    html.classList.add('module-no-scroll')
    body.classList.add('module-no-scroll')

    return () => {
      html.classList.remove('module-no-scroll')
      body.classList.remove('module-no-scroll')
    }
  }, [])
}
