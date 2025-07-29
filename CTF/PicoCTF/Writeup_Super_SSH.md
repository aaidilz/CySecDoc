
# PicoCTF - Super SSH Writeup

## Deskripsi Challenge

Bisakah kamu melakukan SSH sebagai `ctf-player` ke `titan.picoctf.net` pada port `61746` untuk mendapatkan flag?

```bash
ssh ctf-player@titan.picoctf.net -p 61746
```

## Solusi

Setelah berhasil terhubung, masukkan password berikut (password tertera di deskripsi challenge):

```bash
6abf4a82
```

Setelah login, kamu akan masuk ke shell yang terbatas. Cari flag di dalam shell tersebut.

Berikut adalah flag-nya:

```bash
Welcome ctf-player, here's your flag: picoCTF{s3cur3_c0nn3ct10n_65a7a106}
```
