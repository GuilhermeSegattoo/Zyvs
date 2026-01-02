# 📥 Sistema de Importação de Contatos - Implementação Híbrida

**Projeto**: Zyva CRM
**Feature**: Importação em massa de contatos (CSV/Excel)
**Abordagem**: Híbrida (Síncrona + Assíncrona com BullMQ)
**Data**: 02/01/2026

---

## 🎯 Visão Geral

Sistema inteligente que decide automaticamente a melhor forma de processar a importação:
- **Arquivos pequenos** (<500 linhas): Processamento síncrono instantâneo
- **Arquivos grandes** (≥500 linhas): Processamento assíncrono em background com BullMQ

---

## 📋 Especificações Técnicas

### Limites e Thresholds

```typescript
const IMPORT_CONFIG = {
  // Arquivos
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
  ALLOWED_FORMATS: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],

  // Threshold para decisão síncrono vs assíncrono
  SYNC_THRESHOLD: 500,  // linhas

  // Limites absolutos
  MAX_CONTACTS_PER_IMPORT: 50000,

  // Batch processing
  BATCH_SIZE: 100,  // Inserir 100 de cada vez no banco

  // Progress updates (apenas assíncrono)
  PROGRESS_UPDATE_INTERVAL: 50,  // Atualizar a cada 50 contatos processados
};
```

### Campos Suportados

#### Campos Obrigatórios:
- `name` OU `email` (pelo menos um deve estar presente)

#### Campos Padrão:
```typescript
interface ContactImportRow {
  // Obrigatórios (um dos dois)
  name?: string;
  email?: string;

  // Opcionais
  phone?: string;
  company?: string;
  position?: string;
  city?: string;
  state?: string;

  // Tags (string separada por vírgula)
  tags?: string;  // "vip,cliente,urgente"

  // Observações
  notes?: string;

  // Campos customizados (JSON)
  customFields?: Record<string, any>;
}
```

---

## 🏗️ Arquitetura

### Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│  1. Upload arquivo (drag & drop)                               │
│  2. Validação inicial (tamanho, formato)                       │
│  3. Parse preview (primeiras 10 linhas)                        │
│  4. Mapeamento de colunas                                      │
│  5. Configurações (duplicatas, atualizar, etc)                 │
│  6. POST /api/contacts/import                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  Controller: Recebe arquivo + configurações                    │
│              ↓                                                  │
│  Parse Service: CSV/Excel → JSON array                         │
│              ↓                                                  │
│  Decisão: rowCount < 500?                                      │
│         ↙              ↘                                        │
│    SIM (< 500)      NÃO (≥ 500)                                │
│         ↓                ↓                                      │
│  SYNC PROCESSING    ASYNC PROCESSING                           │
│  - Validar tudo     - Criar job BullMQ                         │
│  - Inserir batch    - Retornar jobId                           │
│  - Retornar resultado - Worker processa                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BULLMQ WORKER (Async)                        │
├─────────────────────────────────────────────────────────────────┤
│  1. Processar em batches de 100                                │
│  2. Para cada batch:                                           │
│     - Validar                                                  │
│     - Verificar duplicatas                                     │
│     - Inserir no banco                                         │
│     - Atualizar progresso no Redis                            │
│  3. Finalizar job com resultado completo                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Poll/WebSocket)                    │
├─────────────────────────────────────────────────────────────────┤
│  GET /api/contacts/import/:jobId/status                        │
│  {                                                              │
│    status: 'processing' | 'completed' | 'failed',             │
│    progress: { current: 250, total: 1000 },                   │
│    result: { success: 230, duplicates: 15, errors: 5 }        │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Implementação Backend

### 1. Estrutura de Arquivos

```
backend/src/modules/contacts/
├── contacts.schema.ts              # Schemas Zod
├── contacts.service.ts             # CRUD básico
├── contacts.controller.ts          # Endpoints
├── contacts.routes.ts              # Rotas
├── import/
│   ├── import.service.ts          # Lógica principal de importação
│   ├── import.validator.ts        # Validação de dados
│   ├── import.parser.ts           # Parse CSV/Excel
│   └── import.types.ts            # Types TypeScript

backend/src/jobs/
├── queues/
│   └── contact-import.queue.ts    # Definição da fila BullMQ
└── workers/
    └── contact-import.worker.ts   # Worker que processa jobs
```

### 2. Dependências Necessárias

```bash
# Backend
npm install multer csv-parser xlsx bullmq ioredis
npm install @types/multer @types/csv-parser -D

# Frontend
npm install react-dropzone papaparse xlsx
npm install @types/papaparse -D
```

### 3. Schemas Zod

```typescript
// contacts.schema.ts

import { z } from 'zod';

// Schema para um contato individual
export const contactSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
  customFields: z.record(z.any()).optional(),
}).refine(
  (data) => data.name || data.email,
  { message: 'Pelo menos nome ou email deve ser fornecido' }
);

// Schema para configurações de importação
export const importConfigSchema = z.object({
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
  createTags: z.boolean().default(true),
  columnMapping: z.record(z.string()),  // { "Nome Completo": "name", "E-mail": "email" }
});

// Schema para resultado da importação
export const importResultSchema = z.object({
  total: z.number(),
  success: z.number(),
  duplicates: z.number(),
  errors: z.number(),
  errorDetails: z.array(z.object({
    line: z.number(),
    field: z.string().optional(),
    value: z.string().optional(),
    error: z.string(),
  })),
});
```

### 4. Endpoint Principal

```typescript
// contacts.routes.ts

import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  importContacts,
  getImportStatus,
  downloadImportErrors,
} from './contacts.controller';

export async function contactsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // Upload e iniciar importação
  fastify.post('/import', {
    schema: {
      consumes: ['multipart/form-data'],
    },
  }, importContacts);

  // Verificar status de importação assíncrona
  fastify.get('/import/:jobId/status', getImportStatus);

  // Baixar CSV com erros
  fastify.get('/import/:jobId/errors', downloadImportErrors);
}
```

### 5. Controller

```typescript
// contacts.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { ImportService } from './import/import.service';
import { importConfigSchema } from './contacts.schema';

const importService = new ImportService();

export async function importContacts(req: FastifyRequest, reply: FastifyReply) {
  try {
    // 1. Receber arquivo via multipart
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ error: 'Arquivo não enviado' });
    }

    // 2. Validar tipo e tamanho
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'Formato não suportado. Use CSV ou Excel.' });
    }

    // 3. Receber configurações do body
    const fields = data.fields;
    const config = importConfigSchema.parse({
      skipDuplicates: fields.skipDuplicates?.value === 'true',
      updateExisting: fields.updateExisting?.value === 'true',
      createTags: fields.createTags?.value === 'true',
      columnMapping: JSON.parse(fields.columnMapping?.value || '{}'),
    });

    // 4. Processar importação
    const result = await importService.processImport({
      file: data,
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      config,
    });

    // 5. Retornar resultado
    // Se síncrono: { type: 'sync', result: {...} }
    // Se assíncrono: { type: 'async', jobId: '...' }
    return reply.send(result);

  } catch (error: any) {
    return reply.status(500).send({
      error: 'Erro ao processar importação',
      message: error.message,
    });
  }
}

export async function getImportStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { jobId } = req.params as { jobId: string };
    const status = await importService.getJobStatus(jobId);
    return reply.send(status);
  } catch (error: any) {
    return reply.status(404).send({ error: 'Job não encontrado' });
  }
}
```

### 6. Import Service (Lógica Principal)

```typescript
// import/import.service.ts

import { ImportParser } from './import.parser';
import { ImportValidator } from './import.validator';
import { contactImportQueue } from '../../../jobs/queues/contact-import.queue';
import { prisma } from '../../../lib/prisma';

const SYNC_THRESHOLD = 500;

export class ImportService {
  private parser = new ImportParser();
  private validator = new ImportValidator();

  async processImport(params: {
    file: any;
    userId: string;
    organizationId: string;
    config: any;
  }) {
    const { file, userId, organizationId, config } = params;

    // 1. Parse arquivo para array de objetos
    const rows = await this.parser.parse(file, config.columnMapping);

    // 2. Decidir: síncrono ou assíncrono?
    if (rows.length < SYNC_THRESHOLD) {
      // SYNC: Processar imediatamente
      const result = await this.processSyncImport(rows, userId, organizationId, config);
      return { type: 'sync', result };
    } else {
      // ASYNC: Criar job no BullMQ
      const job = await contactImportQueue.add('import-contacts', {
        rows,
        userId,
        organizationId,
        config,
      });

      return { type: 'async', jobId: job.id };
    }
  }

  private async processSyncImport(rows: any[], userId: string, organizationId: string, config: any) {
    const result = {
      total: rows.length,
      success: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [] as any[],
    };

    const successfulContacts: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNumber = i + 2; // +2 porque linha 1 é header

      try {
        // Validar dados
        const validatedData = this.validator.validate(row);

        // Verificar duplicata por email
        if (validatedData.email && config.skipDuplicates) {
          const existing = await prisma.contact.findFirst({
            where: {
              organizationId,
              email: validatedData.email,
            },
          });

          if (existing) {
            if (config.updateExisting) {
              // Atualizar existente
              await prisma.contact.update({
                where: { id: existing.id },
                data: validatedData,
              });
              result.success++;
            } else {
              result.duplicates++;
            }
            continue;
          }
        }

        // Adicionar à lista de sucesso
        successfulContacts.push({
          ...validatedData,
          organizationId,
          createdById: userId,
        });

      } catch (error: any) {
        result.errors++;
        result.errorDetails.push({
          line: lineNumber,
          error: error.message,
          value: JSON.stringify(row),
        });
      }
    }

    // Inserir em batch (performance)
    if (successfulContacts.length > 0) {
      await prisma.contact.createMany({
        data: successfulContacts,
        skipDuplicates: true,
      });
      result.success += successfulContacts.length;
    }

    return result;
  }

  async getJobStatus(jobId: string) {
    const job = await contactImportQueue.getJob(jobId);

    if (!job) {
      throw new Error('Job não encontrado');
    }

    const state = await job.getState();
    const progress = job.progress;

    return {
      status: state,  // 'waiting', 'active', 'completed', 'failed'
      progress,
      result: job.returnvalue,
    };
  }
}
```

### 7. BullMQ Queue Definition

```typescript
// jobs/queues/contact-import.queue.ts

import { Queue } from 'bullmq';
import { redis } from '../../lib/redis';

export const contactImportQueue = new Queue('contact-import', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 3600, // Manter por 1 hora após completar
      count: 100,
    },
    removeOnFail: {
      age: 86400, // Manter por 24h se falhar
    },
  },
});
```

### 8. BullMQ Worker

```typescript
// jobs/workers/contact-import.worker.ts

import { Worker } from 'bullmq';
import { redis } from '../../lib/redis';
import { prisma } from '../../lib/prisma';
import { ImportValidator } from '../../modules/contacts/import/import.validator';

const BATCH_SIZE = 100;
const validator = new ImportValidator();

export const contactImportWorker = new Worker(
  'contact-import',
  async (job) => {
    const { rows, userId, organizationId, config } = job.data;

    const result = {
      total: rows.length,
      success: 0,
      duplicates: 0,
      errors: 0,
      errorDetails: [] as any[],
    };

    // Processar em batches
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const successfulContacts: any[] = [];

      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        const lineNumber = i + j + 2;

        try {
          const validatedData = validator.validate(row);

          // Verificar duplicata
          if (validatedData.email && config.skipDuplicates) {
            const existing = await prisma.contact.findFirst({
              where: { organizationId, email: validatedData.email },
            });

            if (existing) {
              if (config.updateExisting) {
                await prisma.contact.update({
                  where: { id: existing.id },
                  data: validatedData,
                });
                result.success++;
              } else {
                result.duplicates++;
              }
              continue;
            }
          }

          successfulContacts.push({
            ...validatedData,
            organizationId,
            createdById: userId,
          });

        } catch (error: any) {
          result.errors++;
          result.errorDetails.push({
            line: lineNumber,
            error: error.message,
          });
        }
      }

      // Inserir batch
      if (successfulContacts.length > 0) {
        await prisma.contact.createMany({
          data: successfulContacts,
          skipDuplicates: true,
        });
        result.success += successfulContacts.length;
      }

      // Atualizar progresso
      const progress = Math.round(((i + batch.length) / rows.length) * 100);
      await job.updateProgress(progress);
    }

    return result;
  },
  {
    connection: redis,
    concurrency: 2, // Processar 2 jobs em paralelo
  }
);

// Eventos
contactImportWorker.on('completed', (job) => {
  console.log(`✅ Importação ${job.id} completa:`, job.returnvalue);
});

contactImportWorker.on('failed', (job, err) => {
  console.error(`❌ Importação ${job?.id} falhou:`, err.message);
});
```

---

## 🎨 Implementação Frontend

### 1. Estrutura de Componentes

```
frontend/app/(app)/clientes/
├── page.tsx                    # Lista de contatos
├── importar/
│   └── page.tsx               # Página de importação
└── components/
    ├── ImportDropzone.tsx     # Drag & drop
    ├── ImportPreview.tsx      # Preview das primeiras linhas
    ├── ColumnMapper.tsx       # Mapear colunas
    ├── ImportConfig.tsx       # Configurações (duplicatas, etc)
    ├── ImportProgress.tsx     # Barra de progresso
    └── ImportResult.tsx       # Resultado final
```

### 2. Fluxo de Telas

```typescript
// Step 1: Upload
<ImportDropzone onFileSelect={handleFile} />

// Step 2: Preview + Mapeamento
<ImportPreview data={previewData} />
<ColumnMapper
  fileColumns={['Nome Completo', 'E-mail', 'Telefone']}
  systemFields={['name', 'email', 'phone', 'company']}
  mapping={mapping}
  onChange={setMapping}
/>

// Step 3: Configurações
<ImportConfig
  config={config}
  onChange={setConfig}
/>

// Step 4: Processar
<Button onClick={handleImport}>Importar {rowCount} contatos</Button>

// Step 5: Progresso (apenas async)
<ImportProgress jobId={jobId} onComplete={handleComplete} />

// Step 6: Resultado
<ImportResult result={result} />
```

---

## 🔄 Fluxo de Polling (Frontend)

```typescript
// Polling para importações assíncronas
const useImportStatus = (jobId: string | null) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const response = await api.get(`/api/contacts/import/${jobId}/status`);
      setStatus(response.data);

      // Parar polling quando concluído
      if (['completed', 'failed'].includes(response.data.status)) {
        clearInterval(interval);
      }
    }, 2000); // Poll a cada 2 segundos

    return () => clearInterval(interval);
  }, [jobId]);

  return status;
};
```

---

## ✅ Checklist de Implementação

### Backend:
- [ ] Instalar dependências (multer, csv-parser, xlsx, bullmq)
- [ ] Criar schemas Zod de validação
- [ ] Implementar ImportParser (CSV/Excel)
- [ ] Implementar ImportValidator
- [ ] Criar ImportService (lógica principal)
- [ ] Criar endpoint POST /api/contacts/import
- [ ] Criar endpoint GET /api/contacts/import/:jobId/status
- [ ] Criar BullMQ queue
- [ ] Criar BullMQ worker
- [ ] Testar importação síncrona (<500 linhas)
- [ ] Testar importação assíncrona (≥500 linhas)
- [ ] Tratamento de erros e duplicatas

### Frontend:
- [ ] Instalar dependências (react-dropzone, papaparse, xlsx)
- [ ] Criar componente ImportDropzone
- [ ] Criar preview do arquivo
- [ ] Criar ColumnMapper
- [ ] Criar ImportConfig
- [ ] Criar ImportProgress
- [ ] Criar ImportResult
- [ ] Implementar polling de status
- [ ] Template CSV para download
- [ ] Tratamento de erros

---

## 🎯 Resultado Final

**Para o usuário:**
1. Arrasta arquivo CSV/Excel
2. Vê preview das primeiras linhas
3. Mapeia colunas (se necessário)
4. Configura opções (duplicatas, atualizar)
5. Clica em "Importar"
6. Se < 500 linhas: Resultado instantâneo
7. Se ≥ 500 linhas: Barra de progresso + resultado ao final

**Performance:**
- 500 contatos: ~2-3 segundos (síncrono)
- 10.000 contatos: ~30-60 segundos (assíncrono)
- 50.000 contatos: ~3-5 minutos (assíncrono)

---

**Criado em**: 02/01/2026
**Status**: 📋 Planejamento completo - Pronto para implementação
