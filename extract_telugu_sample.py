"""
Extract sample pages from Telugu Nighantuvu PDF to understand format.
"""
import pdfplumber
import os

pdf_path = "2015.386363.telugu-nighantuvu_text.pdf"

print(f"Opening: {pdf_path}")
print(f"File size: {os.path.getsize(pdf_path) / (1024*1024):.1f} MB")

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Extract first 5 pages to understand format
    print("\n" + "="*50)
    print("SAMPLE CONTENT (Pages 10-15)")
    print("="*50 + "\n")
    
    for i in range(10, 16):  # Pages 10-15 (skip cover/intro)
        if i >= len(pdf.pages):
            break
        page = pdf.pages[i]
        text = page.extract_text()
        print(f"\n--- Page {i+1} ---")
        if text:
            # Print first 1000 chars
            print(text[:1000])
        else:
            print("[No text extracted]")
