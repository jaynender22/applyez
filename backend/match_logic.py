import re
from collections import Counter

STOP = {"the","and","to","of","in","a","for","with","on","as","is","are","be","or","an","by","from","this","that"}

def tokenize(text: str):
    words = re.findall(r"[a-zA-Z0-9\+\#]+", text.lower())
    return [w for w in words if w not in STOP and len(w) > 2]

def top_keywords(text: str, k=25):
    toks = tokenize(text)
    return [w for w, _ in Counter(toks).most_common(k)]

def score(text: str, keywords: list[str]) -> int:
    t = set(tokenize(text))
    k = set(keywords)
    return len(t & k)
