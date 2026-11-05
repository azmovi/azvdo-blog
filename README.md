# azvdo-blog

Blog em [Zola](https://www.getzola.org).

```bash
zola serve                            # http://127.0.0.1:1111
./build.sh                            # falha em qualquer erro ou aviso
git config core.hooksPath .githooks   # uma vez: roda o build antes de cada commit
```

Post em `content/posts/<slug>.md`:

```markdown
---
title: Título
date: 2026-11-05
taxonomies:
  tags: [pessoal]
---

Resumo.

<!-- more -->

Resto do post.
```

Álbum em `content/fotos/<slug>/index.md`, com as mídias na mesma pasta (a primeira é a capa e precisa ser foto):

```markdown
---
title: Nome do álbum
date: 2026-11-05
extra:
  media:
    - src: ./foto.jpg
      alt: descrição
---
```
