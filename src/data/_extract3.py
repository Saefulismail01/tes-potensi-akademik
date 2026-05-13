import fitz
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

doc = fitz.open(r'C:\Users\ThinkPad\Documents\Projects\PAPS\source\pdf-daftar-sinonim-yang-sering-digunakan-pada-soal-tpa-oto-bappenas_compress.pdf')
print(f'Total: {len(doc)} halaman')

all_text = []
for i, page in enumerate(doc):
    text = page.get_text().strip()
    print(f'\n=== HALAMAN {i+1} ({len(text)} chars) ===')
    print(text[:2000])
    all_text.append(text)
