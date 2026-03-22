---
title: 'RAG in Practice: Embeddings, FAISS, and Semantic Retrieval'
date: '2025-02-18'
tags: ['NLP', 'Python', 'MLOps']
excerpt: 'How I built a semantic search engine using sentence embeddings and FAISS, and what I learned about recall vs. latency tradeoffs in production.'
lang: 'en'
readTime: '5 min read'
reference: 'rag-practice'
---

## The problem

Keyword search doesn't work when users don't know the exact term. We need semantics — searching by *meaning*, not just words.

## The solution: embeddings + FAISS

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

# Index documents
embeddings = model.encode(documents)
index = faiss.IndexFlatIP(embeddings.shape[1])
faiss.normalize_L2(embeddings)
index.add(embeddings)

# Search
def search(query: str, k: int = 5):
    vec = model.encode([query])
    faiss.normalize_L2(vec)
    scores, indices = index.search(vec, k)
    return [(documents[i], scores[0][j]) for j, i in enumerate(indices[0])]
```

## Production tradeoffs

- **`IndexFlatIP`**: exact, but slow for >1M docs
- **`IndexIVFFlat`**: approximate, much faster
- **`IndexHNSW`**: best recall/latency, uses more memory

For 500k documents, `IndexIVFFlat` with `nlist=256` gave a recall@10 of 94% with 8ms latency. Good enough for production.
