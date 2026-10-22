/**
 * Utilitas pengacakan bersama (Fisher-Yates Shuffle).
 *
 * Dipakai Modul 3 & Modul 4 agar urutan soal selalu segar setiap sesi.
 * Tidak mengubah array asli.
 */

export const shuffle = (items) => {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temporary = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = temporary
  }

  return result
}
