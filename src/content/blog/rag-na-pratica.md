---
title: 'RAG na Prática: Embeddings, FAISS e Recuperação Semântica'
date: '2025-02-18'
tags: ['NLP', 'Python', 'MLOps']
excerpt: 'Como construí um motor de busca semântica com embeddings de sentenças e FAISS, e o que aprendi sobre tradeoffs de recall vs. latência em produção.'
lang: 'pt'
readTime: '5 min de leitura'
reference: 'rag-practice'
---

## O problema

Busca por palavras-chave não funciona quando os usuários não sabem o termo exato. Precisamos de semântica — buscar pelo *significado*, não pelas palavras.

## A solução: embeddings + FAISS

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

# Indexar documentos
embeddings = model.encode(documents)
index = faiss.IndexFlatIP(embeddings.shape[1])
faiss.normalize_L2(embeddings)
index.add(embeddings)

# Buscar
def search(query: str, k: int = 5):
    vec = model.encode([query])
    faiss.normalize_L2(vec)
    scores, indices = index.search(vec, k)
    return [(documents[i], scores[0][j]) for j, i in enumerate(indices[0])]
```

## Tradeoffs em produção

- **`IndexFlatIP`**: exato, mas lento para >1M docs
- **`IndexIVFFlat`**: aproximado, muito mais rápido
- **`IndexHNSW`**: melhor recall/latência, mais memória

Para 500k documentos, `IndexIVFFlat` com `nlist=256` deu recall@10 de 94% com latência de 8ms. Suficientemente bom para produção.
