import json
import logging
import re
import sys
from pathlib import Path

from pypdf import PdfReader

logging.getLogger("pypdf").setLevel(logging.CRITICAL)


PATTERNS = {
    "email address": r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}",
    "mainland China mobile number": r"(?<!\d)(?:\+?86[-\s]?)?1[3-9]\d{9}(?!\d)",
    "landline number": r"(?<!\d)(?:\+?86[-\s]?)?0\d{2,3}[-\s]?\d{7,8}(?!\d)",
    "WeChat identifier": r"(?:微信|WeChat)\s*(?:ID|号)?\s*[:：]\s*[A-Z][A-Z0-9_-]{5,}",
    "bank, tax or invoice identifier": r"(?:bank\s*account|SWIFT|税号|纳税人识别号|发票号|invoice\s*(?:no|number))\s*[:：]?\s*[A-Z0-9-]{6,}",
    "credential or secret": r"(?:token|api[_ -]?key|secret|password)\s*[:=]\s*[A-Z0-9_\-./+=]{8,}",
    "local absolute path": r"(?:(?<![A-Z0-9])[A-Z]:[\\/]|file:///)",
    "private or local URL": r"https?://[^\s]*(?:sharepoint|onedrive|localhost|127\.0\.0\.1|intranet|internal\.)",
    "commercial amount": r"(?:contract|quotation|budget|payment|reimbursement|invoice|合同|报价|预算|付款|报销|发票)[^\r\n]{0,100}(?:RMB|CNY|USD|KRW|人民币|美元|¥|￥|\$)\s*[\d,.]+",
}
CURRENCY_PATTERN = re.compile(r"(?:RMB|CNY|USD|KRW|人民币|美元|¥|￥|\$)\s*[\d,.]+\s*(?:[KMBT]|万|亿)?", re.I)


def main() -> int:
    source = Path(sys.argv[1])
    result = {"errors": [], "currencyFindings": 0, "pages": 0}
    try:
        reader = PdfReader(source)
        result["pages"] = len(reader.pages)
        metadata = reader.metadata or {}
        for key in ("/Author", "/Creator"):
            if str(metadata.get(key, "")).strip():
                result["errors"].append(f"non-empty PDF metadata field {key}")

        root = reader.trailer.get("/Root", {})
        names = root.get("/Names") if hasattr(root, "get") else None
        if names and names.get_object().get("/EmbeddedFiles"):
            result["errors"].append("embedded PDF files detected")
        if hasattr(root, "get") and (root.get("/OpenAction") or root.get("/AA")):
            result["errors"].append("active PDF open action detected")

        page_text = []
        for page_number, page in enumerate(reader.pages, start=1):
            if page.get("/Annots"):
                result["errors"].append(f"PDF annotations detected on page {page_number}")
            page_text.append(page.extract_text() or "")
        text = "\n".join(page_text)

        for label, pattern in PATTERNS.items():
            if re.search(pattern, text, re.I):
                result["errors"].append(label)
        result["currencyFindings"] = len(CURRENCY_PATTERN.findall(text))
    except Exception as exc:
        result["errors"].append(f"PDF inspection failed: {exc}")

    print(json.dumps(result, ensure_ascii=True))
    return 1 if any(item.startswith("PDF inspection failed") for item in result["errors"]) else 0


if __name__ == "__main__":
    raise SystemExit(main())
